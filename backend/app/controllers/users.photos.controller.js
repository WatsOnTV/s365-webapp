/** File.........................................users.photos.controller.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const Photos = require('../models/users.photos.model.js');
const ApiError = require('../ApiError');
const help = require('../models/helpers.model');

function isApiError (value) {
    return value instanceof ApiError;
}

/** Uploads a photo for a user */
exports.putPhoto = async function (req, res) {
    try{
        const id = parseInt(req.params.id);
        const token = req.headers["x-authorization"];
        const image = req.body;
        let imageType = req.get('content-type');
        //Authorise the user
        const auth_id = await help.tokenBelongsToUser(token);
        if(auth_id !== id){
            throw new ApiError("not the users profile photo", 403);
        }

        const fileInfo = await Photos.checkUserHasPhoto(id);
        //Check the image type is jpeg, jpg, gif or png
        if(!(['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(imageType))){
            throw new ApiError(`cannot upload content type '${imageType}'`, 400);
        }

        let filename;
        let fileExt;
        let response;
        if(fileInfo === null) {
            response = 201;
            fileExt = imageType.replace('image/', '');
            filename = `user_${id}.${fileExt}`;
            await Photos.uploadNewUserPhoto(id, image, filename);
        } else{
            response = 200;
            filename = fileInfo[0];
            fileExt = fileInfo[1].replace('image/', '');
            await Photos.updateUserPhoto(id, image, filename);
        }
        res.status(response)
            .contentType(`image/${fileExt}`)
            .send();
    }catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR uploading user photo: ${err.message}`);
    }
};

/**Gets the users photo if they have one, sends HTTP 200 if they have one with the image, or
 * HTTP 404 if they do not have one
 */
exports.getPhoto = async function (req, res) {
    try {

        const id = req.params.id;
        const fileInfo = await Photos.checkUserHasPhoto(id);
        if(!fileInfo) {
            throw new ApiError("user photo does not exist", 404);
        }
        const filename = fileInfo[0];
        const fileMime = fileInfo[1];
        const data = await Photos.readUserPhoto(filename);
        res.contentType(fileMime);
        res.status(200).send(data);
    } catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting user photo: ${err.message}`);
    }
};


/**Deletes the users photo if they have one and removes it form the DB */
exports.delPhoto = async function (req, res) {
    try {
        const id = parseInt(req.params.id);
        const token = req.headers["x-authorization"];
        const auth_id = await help.tokenBelongsToUser(token);

        const fileInfo = await Photos.checkUserHasPhoto(id);
        if(fileInfo == null){
            throw new ApiError("user has no photo", 404);
        }

        if(auth_id !== id){
            throw new ApiError("not the users profile photo", 403);
        }

        await Photos.delPhoto(fileInfo[0]);

        res.status(200)
            .send();
    } catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
            console.log(err);
        }
        res.status(err.code)
            .send(`ERROR getting user photo: ${err.message}`);
    }
};