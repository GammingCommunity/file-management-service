var multer = require('multer')
var Datauri = require('datauri');
const path = require('path');
const storage = multer.memoryStorage();
const multerFileMultiUpload = multer({ storage }).array('files');
const multerFileUploads = multer({ storage }).single('file');

const dUri = new Datauri();
const dataFileUri = (file) => dUri.format(path.extname(file.originalname).toString(), file.buffer)

module.exports = { multerFileUploads, multerFileMultiUpload, dataFileUri };