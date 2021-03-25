/** File.........................................passwords.model.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const bcrypt = require("bcrypt");

exports.hash = function(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

exports.compare = function(password, hash){
    return bcrypt.compareSync(password, hash);
};