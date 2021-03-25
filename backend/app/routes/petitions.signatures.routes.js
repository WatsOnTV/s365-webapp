/** File.........................................petitions.signatures.routes.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const petitionSignatures = require('../controllers/petitions.signatures.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(petitionSignatures.getSignatures)
        .post(petitionSignatures.addSignature)
        .delete(petitionSignatures.deleteSignature);
};
