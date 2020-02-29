const Chat = require('../models/chat.model.js');


// POST a Chat
exports.create = (req, res) => {
    // Create a Chat
    const chat = new Chat(req.body);

    // Save a Chat in the MongoDB
    chat.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FETCH all Regions
exports.findAll = (req, res) => {
    console.log('fine All');
    Chat.find()
        .then(chats => {
            // console.log(chats)
            res.send(chats);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Chat
exports.findOne = (req, res) => {
    Chat.findById(req.params.chatId)
        .then(chat => {
            if (!chat) {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            res.send(chat);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Chat with id " + req.params.chatId
            });
        });
};

// UPDATE a Chat
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find chat and update it
    Chat.findByIdAndUpdate(req.params.chatId, body, { new: true })
        .then(chat => {
            if (!chat) {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            res.send(chat);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            return res.status(500).send({
                message: "Error updating chat with id " + req.params.chatId
            });
        });
};

// DELETE a Chat
exports.delete = (req, res) => {
    Chat.findByIdAndRemove(req.params.chatId)
        .then(chat => {
            if (!chat) {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            res.send({ message: "Chat deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Chat not found with id " + req.params.chatId
                });
            }
            return res.status(500).send({
                message: "Could not delete chat with id " + req.params.chatId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}