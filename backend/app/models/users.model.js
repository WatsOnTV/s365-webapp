/** File.........................................users.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const db = require('../../config/db');
const ApiError = require('../ApiError');
const passwords = require('../models/passwords.model');

/** Returns a new user token */
function createToken() {
    return Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);
}

/**Checks that the given token is unique and not already in the database (possible, not likely)
 * will enter into a loop creating a new token until it is unique*/
async function getToken(){
    const connection = await db.getPool();
    let token = createToken();
    let q = `SELECT auth_token FROM User WHERE auth_token='${token}'`;
    let [rows, _] = await connection.query(q);
    while(rows.length > 0){
        token = createToken();
        q = `SELECT auth_token FROM User WHERE auth_token='${token}'`;
        [rows, _] = await connection.query(q);
    }

    return token;
}

/** Checks if a user is authenticated given the users token and ID*/
async function isAuth(id, token){
    const connection = await db.getPool();
    //need to check if the user is authenticated
    let q = `SELECT auth_token FROM User WHERE user_id=${id}`;
    let [rows, _] = await connection.query(q);
    if(rows.length === 0) {
        throw new ApiError("no user found", 404);
    }
    return token && rows[0]["auth_token"] === token;
}

/** Authenticate the user and gives them a cookie if user+pass is correct */
exports.login = async function (body) {
    const connection = await db.getPool();
    const email = body["email"];
    const password = body["password"];
    let q=`SELECT password from User WHERE email='${email}'`;
    let [rows, _] = await connection.query(q);

    if(rows.length === 0){
        throw new ApiError('invalid email or password', 400);
    }

    const result = passwords.compare(password, rows[0]["password"]);
    if(!result){
        throw new ApiError('invalid email or password', 400);
    }

    const token = await getToken();
    q = `UPDATE User Set auth_token = '${token}' WHERE email = '${email}';`;
    await connection.query(q);

    q = `SELECT user_id as userId, auth_token as token FROM User WHERE email='${email}';`;
    [rows, _] = await connection.query(q);


    return rows[0];
};

/** If the given token is for a user then remove it from the DB and return 200, else return 400 */
exports.logout = async function(token){
    const connection = await db.getPool();
    let q = `SELECT user_id FROM User WHERE auth_token = '${token}'`;
    let [rows, _] = await connection.query(q);
    if(rows.length === 0) {
        throw new ApiError(`no user exists for token '${token}'`, 401);
    }
    q = `UPDATE User SET auth_token = NULL WHERE user_id=${rows[0]["user_id"]}`;
    await connection.query(q);
};

/** Will register the user with an account */
exports.register = async function(body){
    const connection = await db.getPool();
    if(!(body["name"] && body["email"] && body["password"])){
        throw new ApiError("name, email or password missing", 400);
    }

    // Checks to see if the email is in use
    let q = `SELECT * FROM User WHERE email='${body["email"]}'`;
    let [rows, _] = await connection.query(q);
    if(rows.length > 0){
        throw new ApiError("email already in use", 400)
    }

    //Checks to see if the email is valid (contains '@')
    if(!body['email'].includes('@')){
        throw new ApiError("not a valid email", 400)
    }

    //Hash & salt the password
    const hash = await passwords.hash(body["password"]);

    //Construct the SQL query
    q = `INSERT INTO User (email, name, password`;
    let values = `'${body["email"]}', '${body["name"]}', '${hash}'`;

    if(body["city"]){
        q += ", city";
        values += `, '${body["city"]}'`;
    }
    if(body["country"]){
        q += ", country";
        values += `, '${body["country"]}'`;
    }
    q += `) VALUES (${values})`;

    [rows, _] = await connection.query(q);
    return {"userId":rows["insertId"]};
};

/** Returns a user */
exports.getUser = async function(id, token){
    const connection = await db.getPool();
    let q;
    if(await isAuth(id, token)){
        q = `SELECT name, city, country, email FROM User WHERE user_id=${id}`;
    }else{
        //is not authenticated
        q = `SELECT name, city, country FROM User WHERE user_id=${id}`;
    }
    [rows, _] = await connection.query(q);

    return rows[0];
};

/** Updates a user if the user is authenticated */
exports.updateUser = async function(id, token, body){
    const connection = await db.getPool();

    if(await isAuth(id, token)){
        if(body["password"]){
            if(!body["currentPassword"]){
                throw new ApiError("current password not provided", 401);
            }
            let pw_q = `SELECT password FROM User WHERE user_id=${id}`;
            let [rows, _] = await connection.query(pw_q);
            const result = passwords.compare(body["currentPassword"], rows[0]["password"]);
            if(!result){
                throw new ApiError('invalid email or password', 400);
            }

        }
        let to_update = '';
        if(body["name"]){
            to_update += `name='${body["name"]}',`;
        }
        if(body["email"]){
            to_update += `email='${body["email"]}',`;
        }
        if(body["password"]){
            to_update += `password='${body["password"]}',`;
        }
        if(body["city"]){
            to_update += `city='${body["city"]}',`;
        }
        if(body["country"]){
            to_update += `country='${body["country"]}',`;
        }
        if(to_update === ''){
            throw new ApiError("No changes provided", 400)
        }
        to_update = to_update.slice(0, -1);

        const q = `UPDATE User SET ${to_update} WHERE user_id=${id}`;
        await connection.query(q);

    }else{
        //do something
        throw new ApiError("user not authenticated", 401)
    }
};