/** File.........................................users.photos.routes.js
 *  Author.......................................Daniel Watson
 *  Student ID...................................32227228
 *  Student Code.................................djw187
 *  Date.........................................March 2020
 */

const photos = require('../controllers/users.photos.controller.js');

module.exports = function (app) {
    app.route(app.rootUrl + '/users/:id/photo')
        .get(photos.getPhoto)
        .put(photos.putPhoto)
        .delete(photos.delPhoto);
};
