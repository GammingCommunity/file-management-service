const express = require("express");
const cors = require("cors");
const checkSession = require("./middleware/checkSession");
const {
  dataUri,
  multerMultiUpload,
  multerUploads,

} = require("./services/multer_media");
const { dataFileUri, multerFileMultiUpload, multerFileUploads
} = require('./services/multer_file');
const uploadFile = require('./services/uploadFile');
const uploadMedia = require("./services/uploadImage");
const uploadGroupImage = require("./services/uploadGroupProfile");
const uploadProfile = require("./services/uploadProfile");
const uploadPostMedia = require('./services/uploadPostImage');
const getAccountInfo = require("./util/getAccountInfo");
const {
  updateAvatar,
  chatMedia,
  chatFile,
  updateGroup,
  userPost
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
  const receive_id = req.body.receive_id.toString();

  var uploadResult = [];
  try {
    for (const item of req.files) {

      const fileNameWithExt = item.originalname;
      var fileName = fileNameWithExt.substr(0, fileNameWithExt.lastIndexOf('.'));
      console.log(fileName);

      const file = dataUri(item).content;
      const sentTo = type == "room" ? id : receive_id;

      var media = await uploadMedia(file, id, type, fileName);
      res.status(200).json({ message: `Send media OK.`, data: media })
      /*chatMedia(req.headers.token, sentTo, type, media, fileName)
        .then((v) => {
          v == true ? res.status(200).json({ message: "Chat OK.", data: media.url })
            : res.status(400).json({ message: "Chat unsuccessful." });;
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: "Chat unsuccessful." });
        });*/
    }
  } catch (error) {
    res.status(400).json({ message: "Chat unsuccessful." });
  }
});
app.post("/chat-file/:type/:id", multerFileMultiUpload, async (req, res) => {
  //id mean chatID or groupID
  const id = req.params.id;
  const postType = req.params.type;
  const receive_id = req.body.receive_id.toString();


  try {
    for (const item of req.files) {
      const file = dataFileUri(item).content;

      var fileName = item.originalname;
      const id = postType == "room" ? id : receive_id;

      var media = await uploadFile(file, id, postType, fileName);
      res.status(200).json({ message: "Send file OK.", data: media })
      /* chatFile(req.headers.token, receive_id, postType, media)
         .then((v) => {
           v == true ? res.status(200).json({ message: "Send file OK.", data: media.url })
             : res.status(400).json({ message: "Send file not successful" });
 
         }).catch((err) => {
           console.log(err);
 
           res.status(400).json({ message: "Send file not successful" });
         })*/
    }
  } catch (error) {
    res.status(400).json({ message: "Send file not successful" });

  }
});
// multipart pararam = media
//type: profile or cover
app.post("/edit-room/:type/:roomID", multerUploads, async (req, res) => {

  const roomID = req.params.roomID;
  const type = req.params.type;
  const file = dataUri(req.file).content;
  var media = await uploadGroupImage(file, roomID, type);
  updateGroup(req.headers.token, roomID, type, media)
    .then((v) => {
      v == true
        ? res.status(200).json({ message: `Change ${type} OK`, data: media.url })
        : res.status(400).send({ message: "Change fail" });
    }).catch((err) => res.status(400).send(err))

});
app.post('/user-post', multerMultiUpload, async (req, res) => {
  var accountID = getAccountInfo(res.info);
  var urls = [];
  try {
    for (const item of req.files) {

      const fileNameWithExt = item.originalname;
      var fileName = fileNameWithExt.substr(0, fileNameWithExt.lastIndexOf('.'));
      console.log(fileName);

      const file = dataUri(item).content;
      //console.log(item);

      var media = await uploadPostMedia(file, accountID, "user",fileName)
      urls.push(media.url);

    }
    res.status(200).json({ message: `Upload media OK.`, data: urls })

  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: "Upload unsuccessful." });
  }

})
app.post('/group-post/:groupId/', multerMultiUpload, async (req, res) => {
  var accountID = getAccountInfo(res.info);
  const groupID = req.params.groupId;
  var urls = [];
  try {
    for (const item of req.files) {

      const fileNameWithExt = item.originalname;
      var fileName = fileNameWithExt.substr(0, fileNameWithExt.lastIndexOf('.'));
      console.log(fileName);

      const file = dataUri(item).content;
      //console.log(item);

      var media = await uploadPostMedia(file, groupID, "group", fileName)
      urls.push(media.url);

    }
    res.status(200).json({ message: `Upload media OK.`, data: urls })

  } catch (error) {
    res.status(400).json({ message: "Upload unsuccessful." });
  }

})
app.post("/change-avatar", multerUploads, async (req, res) => {
  var accountID = getAccountInfo(res.info);
  try {
    const file = dataUri(req.file).content;
    const fileName = req.file.originalname;
    var result = await uploadProfile(file, accountID, fileName);
    updateAvatar(req.headers.token, result)
      .then((v) => {
        res.status(200).json({ message: "Change OK", data: media.url });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Listen at http://localhost:${port}`);
});
