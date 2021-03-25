/** File.........................................users.photos.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const db = require('../../config/db');
const fs = require('mz/fs');
const ApiError = require('../ApiError');
const photoDirectory = './storage/photos/';

/** Reads the user file
 * @return Buffer containing the user image */
exports.readUserPhoto = async function(filename){
    return await fs.readFile(photoDirectory+filename);
};

/** Checks if the user already has a photo and returns the filename and ext
 * (this could also be done with an SQL query checking the photo_filename field for null)
 * @returns a list containing the filename and the extension if user has photo
 * @returns null if user has no photo */
exports.checkUserHasPhoto = async function(id){
    const connection = await db.getPool();
    const q = `SELECT photo_filename as filename FROM User WHERE user_id=${id}`;
    const [rows, _] = await connection.query(q);
    if(rows.length === 0){
        throw new ApiError("user does not exist", 404);
    }

    if(rows[0]["filename"] == null){
        return null;
    } else{
        let mime;
        let filename = rows[0]["filename"];
        if(filename.includes(".png")){
            mime = 'image/png';
        } else if(filename.includes(".jpg") || filename.includes(".jpeg")){
            mime = 'image/jpeg';
            filename.replace('jpeg', 'jpg');
        } else if(filename.includes(".gif")){
            mime = 'image/gif';
        }
        return [filename, mime];
    }
};

/** Uploads the path to the new user photo and stores it on disk*/
exports.uploadNewUserPhoto = async function (id, image, filename) {
    await fs.writeFile(photoDirectory+filename, image);
    const connection = await db.getPool();
    const q = `UPDATE User Set photo_filename='${filename}' WHERE user_id=${id}`;
    await connection.query(q);
};

/** Uploads the path to the user photo and replaces the previous image with the new one*/
exports.updateUserPhoto = async function (id, image, filename) {
    await this.delPhoto(filename);
    await fs.writeFile(photoDirectory+filename, image);
    const connection = await db.getPool();
    const q = `UPDATE User Set photo_filename='${filename}' WHERE user_id=${id}`;
    await connection.query(q);
};

/** Deletes a user photo from disk and removed it form the DB */
exports.delPhoto = async function(filename){
    await fs.unlink(photoDirectory+filename);
    const connection = await db.getPool();
    const q = `UPDATE User Set photo_filename=null WHERE photo_filename='${filename}'`;

    await connection.query(q);
};