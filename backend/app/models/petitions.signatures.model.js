/** File.........................................petitions.signatures.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const db = require('../../config/db');
const ApiError = require('../ApiError');
const help = require('../models/helpers.model');

/** Gets all the petitions signatures */
exports.getSignatures = async function (petition_id) {
    const connection = await db.getPool();
    let q = `SELECT petition_id FROM Petition WHERE petition_id=${petition_id}`;
    let [rows, _] = await connection.query(q);
    if(rows.length === 0) {
        throw new ApiError("not a valid petition", 404);
    }
    q = `SELECT signatory_id as signatoryId, User.name as name,
             User.city as city, User.country as country, signed_date as signedDate 
             FROM Signature
             INNER JOIN User ON User.user_id = Signature.signatory_id
             INNER JOIN Petition ON Petition.petition_id = Signature.petition_id
             WHERE Signature.petition_id=${petition_id}
             ORDER BY signedDate ASC`;
    [rows,_] = await connection.query(q);
    return rows;
};

/** Adds a users signature to a petition if they have not already signed
 * And the petition has not closed
 */
exports.addSignature = async function (petition_id, token) {
    const connection = await db.getPool();
    const user_id = await help.tokenBelongsToUser(token);

    //Check that the petition exists and is still open
    const petition = await help.petitionExists(petition_id);
    help.checkDateNotInFuture(petition["closing_date"]);

    //Check if the user has already signed the petition
    let q = `SELECT signatory_id FROM Signature WHERE signatory_id=${user_id} AND
                                                  petition_id=${petition_id}`;
    [rows, _] = await connection.query(q);
    if(rows.length > 0) {
        throw new ApiError("petition already signed by user", 403);
    }

    //Change the date to be in SQL format
    const dateNowString = help.dateToSql(new Date());

    //Add the users signature
    q = `INSERT INTO Signature VALUES (${user_id}, ${petition_id}, '${dateNowString}')`;
    await connection.query(q);
};

/** Deletes a signature if the user is not the author, the user is authenticated and petition is open
 */
exports.deleteSignature = async function (petition_id, token) {
    const connection = await db.getPool();
    const user_id = await help.tokenBelongsToUser(token);

    //Check that the petition exists and is still open
    const petition = await help.petitionExists(petition_id);
    const dateNow = new Date();
    const closingDate = new Date(petition["closing_date"]);
    if(dateNow > closingDate) {
        throw new ApiError("petition is closed", 403);
    }
    const author_id = petition["author_id"];

    //Check if the user is the author
    if(author_id === user_id){
        throw new ApiError("author attempted to remove signature from own petition", 403);
    }

    //Check if the user has signed the petition
    let q = `SELECT petition_id FROM Signature WHERE signatory_id=${user_id} AND petition_id=${petition_id}`;
    const [rows, _] = await connection.query(q);
    if(rows.length === 0) {
        throw new ApiError("user has not signed petition", 403);
    }

    //Delete the signature
    q = `DELETE FROM Signature WHERE signatory_id=${user_id} AND petition_id=${petition_id}`;
    await connection.query(q);
};