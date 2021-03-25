/** File.........................................petitions.photos.controller.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const Photos = require('../models/petitions.photos.model.js');
const ApiError = require('../ApiError');
const help = require('../models/helpers.model');

function isApiError (value) {
    return value instanceof ApiError;
}

/** Uploads a photo for a petition */
exports.putPhoto = async function (req, res) {
    try{
        const petition_id = parseInt(req.params.id);
        const token = req.headers["x-authorization"];
        const image = req.body;
        let imageType = req.get('content-type');

        //Authorise the user
        await help.checkUserIsAuthor(token, petition_id);

        const fileInfo = await Photos.checkPetitionHasPhoto(petition_id);

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
            filename = `petition_${petition_id}.${fileExt}`;
            await Photos.uploadNewPetitionPhoto(petition_id, image, filename);
        } else{
            response = 200;
            filename = fileInfo[0];
            fileExt = fileInfo[1].replace('image/', '');
            await Photos.updatePetitionPhoto(petition_id, image, filename);
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
            .send(`ERROR uploading petition photo: ${err.message}`);
    }
};

/**Gets the petitions photo if they have one, sends HTTP 200 if they have one with the image, or
 * HTTP 404 if they do not have one
 */
exports.getPhoto = async function (req, res) {
    try {
        const id = req.params.id;
        const fileInfo = await Photos.checkPetitionHasPhoto(id);

        //Unsure if a petition photo is optional, so have added the below
        if(!fileInfo) {
            throw new ApiError("petition photo does not exist", 404);
        }

        const filename = fileInfo[0];
        const fileMime = fileInfo[1];
        const data = await Photos.readPetitionPhoto(filename);
        res.contentType(fileMime);
        res.status(200).send(data);

    } catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting petition photo: ${err.message}`);
    }
};