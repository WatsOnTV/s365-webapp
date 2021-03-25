/** File.........................................ApiError.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

class ApiError extends Error{
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
    }
}

module.exports = ApiError;