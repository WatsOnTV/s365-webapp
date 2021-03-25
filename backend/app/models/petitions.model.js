/** File.........................................petitions.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const db = require('../../config/db');
const ApiError = require('../ApiError');
const help = require('../models/helpers.model');

/** Builds the SQL Query for retrieving all petitions from the DB
 * @returns an SQL query
 */
function buildGetPetitionsQuery(queries){
    let q =   "SELECT petition_id as petitionId, title, Category.name as category, User.name as authorName, " +
        "(SELECT count(*) FROM Signature WHERE Signature.petition_id=Petition.petition_id) as signatureCount " +
        "FROM Petition " +
        "INNER JOIN Category ON Category.category_id=Petition.category_id " +
        "INNER JOIN User ON author_id=user_id ";
    let constraints = [];

    //Check if the 'q' query exists, if so add the relevant constraint
    if(queries["q"]) {
        constraints.push(`title LIKE "%${queries["q"]}%"`);
    }

    //Check if the 'categoryId' query exists, if so add the relevant constraint
    if(queries["categoryId"]) {
        constraints.push(`Petition.category_id = ${queries["categoryId"]}`);
    }

    //Check if the 'authorId' query exists, if so add the relevant constraint
    if(queries["authorId"]) {
        constraints.push(`Petition.author_id = ${queries["authorId"]}`);
    }

    //If there is a query, add it to the SQL query
    if(constraints.length > 0) {
        q += 'WHERE';
        for(let constraint of constraints) {
            q += ` ${constraint} AND`
        }
        //We need to remove the trailing 'AND', slice it from the string
        q = q.slice(0, -3);
    }

    //Check if the 'sortBy' query exists, if so add the requested ordering
    if(queries["sortBy"]) {
        switch(queries["sortBy"]) {
            case "ALPHABETICAL_ASC":
                q += "ORDER BY title ASC, petitionId ASC";
                break;
            case "ALPHABETICAL_DESC":
                q += "ORDER BY title DESC,Completed /petitions endpoint petitionId ASC";
                break;
            case "SIGNATURES_ASC":
                q += "ORDER BY signatureCount ASC, petitionId ASC";
                break;
            case "SIGNATURES_DESC":
                q += "ORDER BY signatureCount DESC, petitionId ASC";
                break;
            default:
                //Use the Node.js implementation to specify an error code
                throw new ApiError('sortBy query unavailable', 400);
        }
    } else {
        //Default sorting mode
        q += "ORDER BY signatureCount DESC, petitionId ASC";
    }

    return q;
}

/** Gets all petitions when given the user queries
 * @returns Array of results*/
exports.getAllPetitions = async function (queries) {

    const connection = await db.getPool();
    const sql = buildGetPetitionsQuery(queries);
    let [rows, _] = await connection.query(sql);

    //Check if the 'startIndex' query exists, if so remove posts from the start until startIndex reached
    if(queries["startIndex"]) {
        const startIndex = queries["startIndex"];
        for(let i=0; i < startIndex; i++) {
            rows.shift();
        }
    }

    //Check if the 'count' query exists, if so remove entries form the back of the list
    if(queries["count"]) {
        const count = queries["count"];
        for(let i=rows.length; i>count; i--) {
            rows.pop();
        }
    }

    return rows;
};

/** Creates a new petition if the user is authenticated
 * @throws ApiError if required fields are missing
 * @return petitionId*/
exports.createPetition = async function (title, description, categoryId, closingDate, token) {
    const connection = await db.getPool();
    const user_id = await help.tokenBelongsToUser(token);

    //Check if all the required fields exist
    if(!((title) && (description) && (categoryId))){
        throw new ApiError("required fields missing to make petition", 400);
    }

    await help.checkCategoryExists(categoryId);
    //Convert the date to the correct format for SQL
    const dateNowString = help.dateToSql(new Date());

    let closingDateString;
    let q;
    if(closingDate){
        //Check if the date is in the future
        help.checkDateInFuture(closingDate);
        //Convert to SQL format
        closingDateString = help.dateToSql(closingDate);
        q = `INSERT INTO Petition (title, description,  author_id, category_id, created_date, closing_date)  
                              VALUES ("${title}", "${description}", ${user_id}, ${categoryId}, "${dateNowString}",
                                      "${closingDateString}");`;
    }else{
        q = `INSERT INTO Petition (title, description,  author_id, category_id, created_date, closing_date)  
                              VALUES ("${title}", "${description}", ${user_id}, ${categoryId}, "${dateNowString}",
                                      null);`;
    }



    //Now complete the query


    const [rows, _] = await connection.query(q);

    //Lastly add the users signature to their petition
    q = `INSERT INTO Signature VALUES (${user_id}, ${rows.insertId}, '${dateNowString}')`;
    await connection.query(q);

    return {
        "petitionId":rows.insertId
    };

};

/** Returns a single petition from the DB given the petition ID
 * @return a single petition as a JSON object
 */
exports.getSinglePetition = async function (id) {
    const connection = await db.getPool();
    const q = `SELECT petition_id as petitionId, title, description, author_id as authorId,
               User.name as authorName, User.city as authorCity, User.country as authorCountry, 
               (SELECT count(*) FROM Signature WHERE Signature.petition_id=Petition.petition_id) as signatureCount,
               Category.name as category, created_date as createdDate, closing_date as closingDate
               FROM Petition 
               INNER JOIN Category ON Category.category_id=Petition.category_id 
               INNER JOIN User ON author_id=user_id 
               WHERE petition_id = ${id}`;
    const [rows, _] = await connection.query(q);
    return rows[0];
};


/** Updates a single petition
 * @throws ApiError if no options were given to update
 */
exports.updatePetition = async function (petition_id, token, title, description, categoryId, closingDate) {
    const connection = await db.getPool();

    //Check if the user is the author of the petition
    await help.checkUserIsAuthor(token, petition_id);

    //Check if the body fields are correct
    let values = '';
    if(title){
        values += `title = '${title}', `;
    }
    if(description){
        values += `description = '${description}', `;
    }
    if(categoryId){
        await help.checkCategoryExists(categoryId);
        values += `category_id = ${categoryId}, `;
    }
    if(closingDate){
        help.checkDateInFuture(closingDate);

        //Check if the DB closingDate is in the future
        const dateQ = `SELECT closing_date FROM Petition WHERE petition_id=${petition_id}`;
        const [dateRows, _] = await connection.query(dateQ);
        const closingDateDB = new Date(dateRows[0]["closing_date"]);
        help.checkDateInFuture(closingDateDB);

        //Change closingDateOb to the SQL date format
        const closingDateString = help.dateToSql(new Date(closingDate));
        values += `closing_date = '${closingDateString}', `;
    }
    //Check if there was any data in the body
    if(values === ''){
        throw new ApiError("no values provided", 400);
    }
    //Removing trailing comma
    values = values.slice(0, -2);

    const q = `UPDATE Petition SET ${values} WHERE petition_id=${petition_id}`;
    await connection.query(q);
};

/** Deletes a single petition */
exports.deletePetition = async function (petition_id, token) {
    const connection = await db.getPool();
    //Check if the user is the author of the petition
    await help.checkUserIsAuthor(token, petition_id);

    //Remove signatures from petition
    let q = `DELETE FROM Signature WHERE petition_id=${petition_id}`;
    await connection.query(q);

    //Remove petition
    q = `DELETE FROM Petition WHERE petition_id=${petition_id}`;
    await connection.query(q);
};

/** Returns the whole set of categories
 * @returns rows of all categories*/
exports.getCategories = async function() {
    const connection = await db.getPool();
    const q = `SELECT category_id as categoryId, name FROM Category`;
    const [rows, _] = await connection.query(q);
    return rows;
};