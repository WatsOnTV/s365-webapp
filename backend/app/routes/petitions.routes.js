/** File.........................................petitions.routes.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const petitions = require('../controllers/petitions.controller.js');

module.exports = function (app) {

    app.route(app.rootUrl + '/petitions')
        .get(petitions.getAllPetitions)
        .post(petitions.createPetition);

    app.route(app.rootUrl + '/petitions/categories')
        .get(petitions.getCategories);

    app.route(app.rootUrl + '/petitions/:id')
        .get(petitions.getSinglePetition)
        .patch(petitions.updatePetition)
        .delete(petitions.deletePetition);

};
