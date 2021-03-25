/** File.........................................petitions.photos.routes.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const photos = require('../controllers/petitions.photos.controller.js');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions/:id/photo')
        .get(photos.getPhoto)
        .put(photos.putPhoto);
};
