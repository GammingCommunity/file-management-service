const express = require("express");
const cors = require("cors");
const checkSession = require("./middleware/checkSession");
const {
  dataUri,
  multerMultiUpload,
  multerUploads,

} = require("./services/multer_media");
const { dataFileUri,multerFileMultiUpload,multerFileUploads
 } = require('./services/multer_file');
const uploadFile = require('./services/uploadFile');
const uploadMedia = require("./services/uploadImage");
const uploadGroupImage = require("./services/uploadGroupProfile");
const uploadProile = require("./services/uploadProfile");
const getAccountInfo = require("./util/getAccountInfo");
const {
  updateAvatar,
  chatMedia,
  chatFile
} = require("./services/main-service/update-service");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
//apply middleware
app.use(checkSession);

app.get("/fetch-file/:type/:id", async (req, res) => {
  var id = req.params.id;
  var type = req.params.type;

  var url_ressult = [];
  if (type == "group") {
    var images = await cloudinary.search
      .expression(`folder:group-media/${id}`)
      .sort_by("public_id", "desc")
      .execute()
      .then((v) => {
        return v.resources;
      })
      .catch((err) => []);

    for (const item of images) {
      url_ressult.push({ url: item.secure_url, "created_at:": item.created_at });
    }
  }
  else {
    var images = await cloudinary.search
      .expression(`folder=chat-*/${id} AND tags=${id}`)
      .sort_by("public_id", "desc")
     
      .execute()
      .then((v) => {
        return v.resources;
      })
      .catch((err) => []);

    for (const item of images) {
      url_ressult.push({ url: item.secure_url, "created_at:": item.created_at });
    }
  }
 
  res.json(url_ressult);
});

app.post("/chat-media/:type/:id", multerMultiUpload, async (req, res) => {
  // id mean chatID and roomID
  const id = req.params.id;
  const type = req.params.type;
  var uploadResult = [];
  try {
    for (const item of req.files) {
      console.log(item);

      const file = dataUri(item).content;
      var result = await uploadMedia(file, id, type);
      //uploadResult.push(result);
      chatMedia(req.headers.token, id, type, result)
        .then((v) => {
          res.status(200).json({ message: "Chat OK." });
        })
        .catch((err) => {
          console.log(err);

          res.status(400).json({ message: "Chat unsuccessful." });
        });
    }
  } catch (error) {
    res.status(400);
  }
});
app.post("/chat-file/:type/:id", multerFileMultiUpload, async (req, res) => {
  //id mean chatID or groupID
  const id = req.params.id;
  const type = req.params.type;
  const receive_id = req.body.receive_id.toString();
  
  
  try {
    for (const item of req.files) {
      const file = dataFileUri(item).content;
      var result = await uploadFile(file, id, type);
      chatFile(req.headers.token, receive_id ,type, result)
        .then((v) => {
          res.status(200).json({ message: "Send file OK." });
        }).catch((err) => {
          console.log(err);
          
          res.status(400).json({ message: "Send file not successful" });
        })
    }
  } catch (error) {
    
  }
});

app.post("/edit-room/:roomID/:type", multerUploads, async (req, res) => {
  const roomID = req.params.roomID;
  const type = req.params.type;
  const file = dataUri(req.file).content;
  var result = await uploadGroupImage(file, roomID, type);
  res.json(result);
});

app.post("/change-avatar", multerUploads, async (req, res) => {
  var accountID = getAccountInfo(res.info);
  try {
    const file = dataUri(req.file).content;
    var result = await uploadProile(file, accountID);
    updateAvatar(req.headers.token, result)
      .then((v) => {
        res.status(200).json({ message: "Change OK" });
      })
      .catch((err) => {
        res.status(400).send(error);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Listen at http://localhost:${port}`);
});
