/** File.........................................helpers.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const db = require('../../config/db');
const ApiError = require('../ApiError');

/** Checks if the auth token is related to a user
 * @throws ApiError if token is not related to a user
 * @return user_id token is related to
 */
exports.tokenBelongsToUser = async function(token) {
    const connection = await db.getPool();
    const q = `SELECT user_id FROM User WHERE auth_token='${token}'`;
    const [rows, _] = await connection.query(q);
    if(rows.length === 0) {
        throw new ApiError("auth token invalid", 401);
    }
    return rows[0]["user_id"];
};

/** Checks if the user with the given token is the author of the given petition
 *  Also checks the petition exists, and if the token does not belong to a user
 *  @throws ApiError if the petition does not exist
 *  @throws ApiError if the user is not the author
 */
exports.checkUserIsAuthor = async function (token, petition_id){
    const u_id = await this.tokenBelongsToUser(token);
    const petition = await this.petitionExists(petition_id);
    const a_id = petition["author_id"];
    if(u_id !== a_id){
        throw new ApiError("user is not the author", 403);
    }
};

/** Checks if the given category exists within the DB
 * @throws ApiError if the category does not exist
 */
exports.checkCategoryExists = async function (category) {
    const connection = await db.getPool();
    const q = `SELECT category_id from Category WHERE category_id=${category}`;
    const [rows, _] = await connection.query(q);
    if(rows.length === 0){
        throw new ApiError("unknown category", 400);
    }
};

/** Checks if the given date is in the future
 * @throws ApiError if the date is in the past
 */
exports.checkDateInFuture = function(date){
    const dateNow = new Date();
    if(dateNow >= date){
        throw new ApiError("closing date is not in the future", 400);
    }
};

/** Checks if the given date is NOT in the future
 * @throws ApiError if the date is in the future
 */
exports.checkDateNotInFuture = function(date){
    const dateNow = new Date();
    if(date <= dateNow){
        throw new ApiError("petition is closed", 403);
    }
};

/** Converts the given date to SQL format
 * @returns string in SQL required format
 */
exports.dateToSql = function (date){
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

/** Checks if the given petition exists
 * @throws ApiError if the petition does not exist
 * @return petition information if exists*/
exports.petitionExists = async function (petition_id) {
    const connection = await db.getPool();
    const q = `SELECT * FROM Petition WHERE petition_id=${petition_id}`;
    const [rows,_] = await connection.query(q);
    if(rows.length === 0){
        throw new ApiError("petition does not exist", 404);
    }
    return rows[0];
};