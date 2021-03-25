/** File.........................................petitions.controller.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const Petitions = require('../models/petitions.model.js');
const ApiError = require('../ApiError');

function isApiError (value) {
    return value instanceof ApiError;
}

/** Gets all petitions from the DB */
exports.getAllPetitions = async function (req, res) {
    try{
        const queries = req.query;
        const result = await Petitions.getAllPetitions(queries);
        res.status(200)
            .send(result);

    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting petitions: ${err.message}`);
    }

};

/**Creates a new petition and stores it in the DB*/
exports.createPetition = async function (req, res) {
    try{
        const title = req.body["title"];
        const description = req.body["description"];
        const categoryId = req.body["categoryId"];
        let closingDate;
        if(req.body["closingDate"]){
            closingDate = new Date(req.body["closingDate"])
        }
        const auth = req.headers["x-authorization"];
        const result = await Petitions.createPetition(title, description, categoryId, closingDate, auth);

        res.status(201)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting petitions: ${err.message}`);
    }
};

/**Gets a specifiC petition from the DB*/
exports.getSinglePetition = async function (req, res) {
    try{
        const id = req.params.id;
        const result = await Petitions.getSinglePetition(id);
        res.status(200)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting petition: ${err.message}`);
    }
};

/**Updates a specific petition given the ID */
exports.updatePetition = async function (req, res) {
    try{
        const id = req.params.id;
        const token = req.headers["x-authorization"];
        const title = req.body["title"];
        const description = req.body["description"];
        const categoryId = req.body["categoryId"];
        const closingDate = req.body["closingDate"];
        await Petitions.updatePetition(id, token, title, description, categoryId, closingDate);
        res.status(200)
            .send();
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR updating petitions: ${err.message}`);
    }
};

/**Removes a specific petition from the DB given the ID*/
exports.deletePetition = async function (req, res) {
    try{
        const id = req.params.id;
        const token = req.headers["x-authorization"];
        await Petitions.deletePetition(id, token);
        res.status(200)
            .send();
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR deleting petition: ${err.message}`);
    }
};

/**Returns all categories*/
exports.getCategories = async function (req, res) {
    try{
        const result = await Petitions.getCategories();
        res.status(200)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting categories: ${err.message}`);
    }
};