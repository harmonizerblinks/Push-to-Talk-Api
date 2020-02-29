module.exports = function(app) {

    var file = require('../controllers/file.controller.js');

    // Create a new Gallery
    app.post('/api/file/:type', file.create);

    // Retrieve all Gallery
    /**
     * @swagger
     * /api/file:
     *  get:
     *    description: Use to request all file
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/file', file.findAll);

    // Retrieve a single Gallery by Id
    /**
     * @swagger
     * /api/file/{sliderId}:
     *  get:
     *    description: Use to request slider by Brand  Id
     *    responses:
     *      '200':
     *        description: A successful response
     */
    app.get('/api/file/:fileId', file.findOne);

    // Update a Gallery with Id
    app.put('/api/file/:fileId', file.update);

    // Delete a Gallery with Id
    app.delete('/api/file/:fileId', file.delete);
}