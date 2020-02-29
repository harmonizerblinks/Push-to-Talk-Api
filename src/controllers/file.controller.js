const File = require('../models/file.model.js');
const config = require('../config/mongodb.config.js');
var path = require('path');
const sharp = require('sharp');
const fs = require('fs');
var appDir = path.dirname(require.main.filename);


// POST a File
exports.create = async(req, res) => {
    console.info('started');
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({ message: 'No files were uploaded.' });
    }

    if (!req.params.type) {
        return res.status(400).send({ message: 'Image Type must be Provided.' });
    }
    console.log(req.files.file);
    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    const file = req.files.file;
    const fname = new Date().getTime() + file.name.replace(/ /g, "_");
    const name = appRoot + '/../public/original/' + fname;
    const destination = appRoot + '/../public/' + req.params.type + '/resize_' + fname;
    console.log(name);
    // Use the mv() method to place the file somewhere on your server
    file.mv(name, function(err) {
        if (err) {
            // console.log(err);
            return res.status(500).send(err);
        }
        // console.log(result);
        // Create a File
        const file = new File({ name: fname, url: req.params.type + '/' + fname });

        // Save a File in the MongoDB
        file.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        // res.send('File uploaded!');
    });
};


// FETCH all Files
exports.findAll = (req, res) => {
    console.log('fine All');
    File.find()
        .then(files => {
            // console.log(files)
            res.send(files);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};


// FIND a File
exports.findOne = (req, res) => {
    File.findById(req.params.fileId)
        .then(file => {
            if (!file) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send(file);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            return res.status(500).send({
                message: "Error retrieving File with id " + req.params.fileId
            });
        });
};

// UPDATE a File
exports.update = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find file and update it
    File.findByIdAndUpdate(req.params.fileId, body, { new: true })
        .then(file => {
            if (!file) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send(file);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            return res.status(500).send({
                message: "Error updating file with id " + req.params.fileId
            });
        });
};

// DELETE a File
exports.delete = (req, res) => {
    File.findByIdAndRemove(req.params.fileId)
        .then(file => {
            if (!file) {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            res.send({ message: "File deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "File not found with id " + req.params.fileId
                });
            }
            return res.status(500).send({
                message: "Could not delete file with id " + req.params.fileId
            });
        });
};


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}