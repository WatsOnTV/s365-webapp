/** File.........................................users.controller.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const Users = require('../models/users.model.js');

const ApiError = require('../ApiError');
function isApiError (value) {
    return value instanceof ApiError;
}

/** Sends the user a token if they authenticate correctly */
exports.login = async function (req, res) {
    try{
        const body = req.body;
        const result = await Users.login(body);
        res.status(200)
            .send(result);
    }catch(err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR logging in user: ${err.message}`);
    }
};

/** Checks the users token and removes it from the DB if valid*/
exports.logout = async function (req, res) {
    try{
        const token = req.headers["x-authorization"];
        await Users.logout(token);
        res.status(200)
            .send();
    }catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR logging out user: ${err.message}`);
    }
};

/** Registers the user */
exports.register = async function (req, res) {
    try{
        const body = req.body;
        let result = await Users.register(body);
        res.status(201)
            .send(result);
    }catch(err){
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR registering user: ${err.message}`);
    }
};

/** Returns a single user with the email when authenticated, and without if not */
exports.getUser = async function (req, res) {
    try{
        const id = req.params.id;
        const auth = req.headers["x-authorization"];
        let result = await Users.getUser(id, auth);
        res.status(200)
            .send(result);
    }catch (err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR getting user: ${err.message}`);
    }
};

/** Updates a user */
exports.updateUser = async function (req, res) {
    try{
        const id = req.params.id;
        const auth = req.headers["x-authorization"];
        const result = await Users.updateUser(id, auth, req.body);
        res.status(200)
            .send(result);
    }catch (err) {
        if(!isApiError(err)) {
            //If the error is not an instance of ApiError, it means the server threw a generic error somewhere.
            //Set the code to 500, Internal Server Error.
            err.code = 500;
        }
        res.status(err.code)
            .send(`ERROR updating user: ${err.message}`);
    }
};