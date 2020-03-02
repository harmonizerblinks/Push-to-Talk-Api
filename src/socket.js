module.exports = (io) => {
    var Chats = require('./models/chat.model.js');
    const siofu = require('socketio-file-upload');
    const SocketIOFile = require('socket.io-file');
    const path = require('path');
    connections = [];
    users = [];
    messages = [];
    channel = [];
    io.on('connection', (socket) => {
        console.info('a new user has connected')
        connections.push(socket);
        // var uploader = new siofu();
        // uploader.dir = (path.join(__dirname, '../public'));
        // uploader.listen(socket);


        socket.on('message', (msg) => {
            console.log(msg, socket.userid, socket.username);
            const chat = new Chats(msg);
            chat.userid = socket.userid;
            console.log(chat);
            // Save a Chat in the MongoDB
            chat.save()
                .then(data => {
                    messages.push(data);
                    io.emit('message', data);
                }).catch(err => {
                    console.log(err.message);
                });
        });
        socket.on('set-name', (data) => {
            console.log(data);
            socket.username = data.username;
            socket.userid = data.userid;
            socket.date = new Date();
            data.date = new Date();
            if (!users.includes(data.userid)) {
                channel.push(data);
                users.push(data.userid);
            }
            io.emit('user-changed', { username: data.username, userid: data.userid, event: 'joined' });
        });
        socket.on('channel', () => {
            io.emit('channels', channel);
        });
        socket.on('chats', async(data) => {
            messages = await Chats.find();
            io.emit('messages', messages);
            io.emit('channels', channel);
        });

        socket.on('disconnect', (socket) => {
            console.info('a user has disconnected');
            io.emit('user-changed', { userid: socket.username, username: socket.userid, event: 'left' });
        });

        var uploader = new SocketIOFile(socket, {
            // uploadDir: {			// multiple directories
            // 	music: 'data/music',
            // 	document: 'data/document'
            // },
            uploadDir: (path.join(__dirname, '../public')), // simple directory
            accepts: ['audio/mpeg', 'audio/mp3', 'images/*'], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
            maxFileSize: 5194304, // 4 MB. default is undefined(no limit)
            chunkSize: 10240, // default is 10240(1KB)
            transmissionDelay: 0, // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
            overwrite: true // overwrite file if exists, default is true.
        });
        uploader.on('start', (fileInfo) => {
            console.log('Start uploading');
            console.log(fileInfo);
        });
        uploader.on('stream', (fileInfo) => {
            console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
        });
        uploader.on('complete', (fileInfo) => {
            console.log('Upload Complete.');
            console.log(fileInfo);
        });
        uploader.on('error', (err) => {
            console.log('Error!', err);
        });
        uploader.on('abort', (fileInfo) => {
            console.log('Aborted: ', fileInfo);
        });

    });

    mesaages = Chats.find();
    console.log(messages);
}