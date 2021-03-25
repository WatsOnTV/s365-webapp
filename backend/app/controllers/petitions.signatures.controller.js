/** File.........................................petitions.signatures.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const SignaturePetitions = require('../models/petitions.signatures.model.js');
const ApiError = require('../ApiError');

function isApiError (value) {
    return value instanceof ApiError;
}

exports.getSignatures = async function (req, res) {
    try{
        const id = req.params.id;
        const result = await SignaturePetitions.getSignatures(id);
        res.status(200)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting signatures: ${err.message}`);
    }
};

exports.addSignature = async function (req, res) {
    try{
        const id = req.params.id;
        const token = req.headers["x-authorization"];
        const result = await SignaturePetitions.addSignature(id, token);
        res.status(201)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR adding signature: ${err.message}`);
    }
};

exports.deleteSignature = async  function (req, res) {
    try{
        const id = req.params.id;
        const token = req.headers["x-authorization"];
        const result = await SignaturePetitions.deleteSignature(id, token);
        res.status(200)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR deleting signature: ${err.message}`);
    }
};