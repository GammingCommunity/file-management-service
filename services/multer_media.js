var multer = require('multer')
var Datauri = require('datauri');
const path = require('path');
const storage = multer.memoryStorage();
const multerMultiUpload = multer({ storage }).array('image');
const multerUploads= multer({ storage }).single('image');

const dUri = new Datauri();
const dataUri = (file) => dUri.format(path.extname(file.originalname).toString(), file.buffer)

module.exports = { multerUploads, multerMultiUpload, dataUri };