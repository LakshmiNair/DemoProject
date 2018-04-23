const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();
var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./temp/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
function create({ collectionService }) {
    router.get('/', asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const collections = await collectionService.getCollection(token);
        res.json(collections);
    }));
    router.post('/new_file', upload.single("file"), asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.uploadFile(req.file,req.body,token);
        res.json(dataset);
    }));
    router.post('/new_folder',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const collection = await collectionService.newFolder(req.body,token);
        res.json(collection);
    }));
    router.post('/rename_folder',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const collection = await collectionService.renameFolder(req.body,token);
        res.json(collection);
    }));

    return router;
}

module.exports.create = create;
