module.exports = function(app) {

    var chat = require('../controllers/chat.controller.js');
    const verify = require('../middleware/verifyJwtToken.middleware.js');
    // console.log('chat');

    // Create a new chat
    app.post('/api/chats', chat.create);

    // Retrieve all chat
    app.get('/api/chats', chat.findAll);

    // Retrieve a single chat by Id
    app.get('/api/chats/:chatId', chat.findOne);

    // Update a chat with Id
    app.put('/api/chats/:chatId', chat.update);

    // Delete a chat with Id
    app.delete('/api/chats/:chatId', chat.delete);
}