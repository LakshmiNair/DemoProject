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
    router.get('/', asyncWrapper(async(req, res) => {
        var token = req.headers.authorization;
        const collections = await collectionService.getCollection(token);
        res.json(collections);
    }));
    router.post('/get_files', asyncWrapper(async(req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.getfiles(req.body,token);
        res.json(dataset);
    }));
    router.post('/new_file', upload.single("file"), asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.uploadFile(req.file,req.body,token);
        res.json(dataset);
    }));
    router.post('/new_files', upload.any(), asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.uploadMultipleFiles(req.files,req.body,token);
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
    router.post('/remove_folder',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const collection = await collectionService.removeFolder(req.body,token);
        res.json(collection);
    }));
    router.post('/remove_file',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.removeFile(req.body,token);
        res.json(dataset);
    }));
    router.post('/rename_file',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.renameFile(req.body,token);
        res.json(dataset);
    }));
    router.post('/remove_mFile',  asyncWrapper(async (req, res) => {
        var token = req.headers.authorization;
        const dataset = await collectionService.removemultipleFiles(req.body,token);
        res.json(dataset);
    }));
    return router;
}

module.exports.create = create;
