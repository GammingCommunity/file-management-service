const express = require('express');
const cors = require('cors');
const checkSession = require('./middleware/checkSession');
const { dataUri, multerMultiUpload, multerUploads } = require('./services/multer_media');
const uploadImage = require('./services/uploadImage');
const uploadGroupImage = require('./services/uploadGroupImage');
const uploadProile = require('./services/uploadProfile');
const cloudinary = require('cloudinary').v2;
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());
//apply middleware
app.use(checkSession);

app.get('/fetch-image/:roomID', async (req, res) => {
    var roomID = req.params.roomID;
    var url_ressult = [];
    var images = await cloudinary.search
        .expression(`folder:group-media/${roomID}`)
        .sort_by('public_id', 'desc')
        .execute().then((v) => {
            return v.resources;
        }).catch((err) => []);

    for (const item of images) {

        url_ressult.push({ "url": item.secure_url, "created_at:": item.created_at })

    }
    res.json(url_ressult)
})

app.post('/chat-media/:roomID', multerMultiUpload, async (req, res) => {
    const roomID = req.params.roomID;
    var uploadResult = [];
    for (const item of req.files) {
        const file = dataUri(item).content;
        var result = await uploadImage(file, roomID);
        uploadResult.push(result);

    }
    res.json(uploadResult);

})
app.post('/chat-file/:roomID', async (req, res) => {

})


app.post("/edit-room/:roomID/:type", multerUploads, async (req, res) => {
    const roomID = req.params.roomID;
    const type = req.params.type;
    const file = dataUri(req.file).content;
    var result = await uploadGroupImage(file, roomID, type);
    res.json(result);
})

app.post('/upload-avatar', multerUploads, async (req, res, next) => {
    try {
        const file = dataUri(req).content;
        var result = await uploadProile(file, req.body.profile_id);
        res.json({ "code": "200", "success": true, message: "Upload success", "image_url": result })

    } catch (error) {
        res.status(500).send(error);
    }

})

app.listen(port, () => {
    console.log(`Listen at http://localhost:${port}`);

})