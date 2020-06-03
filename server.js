const express = require("express");
const cors = require("cors");
const checkSession = require("./middleware/checkSession");
const {
  dataUri,
  multerMultiUpload,
  multerUploads,
} = require("./services/multer_media");
const uploadImage = require("./services/uploadImage");
const uploadGroupImage = require("./services/uploadGroupImage");
const uploadProile = require("./services/uploadProfile");
const getAccountInfo = require("./util/getAccountInfo");
const {
  updateAvatar,
  chatMedia,
} = require("./services/main-service/update-service");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
//apply middleware
app.use(checkSession);

app.get("/fetch-media/:roomID", async (req, res) => {
  var roomID = req.params.roomID;
  var url_ressult = [];
  var images = await cloudinary.search
    .expression(`folder:group-media/${roomID}`)
    .sort_by("public_id", "desc")
    .execute()
    .then((v) => {
      return v.resources;
    })
    .catch((err) => []);

  for (const item of images) {
    url_ressult.push({ url: item.secure_url, "created_at:": item.created_at });
  }
  res.json(+url_ressult);
});

app.post("/chat-media/:type/:id", multerMultiUpload, async (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  var uploadResult = [];
  try {
    for (const item of req.files) {
      console.log(item);

      const file = dataUri(item).content;
      var result = await uploadImage(file, id, type);
      //uploadResult.push(result);
      chatMedia(req.headers.token, id, type, result)
        .then((v) => {
          res.status(200).json({ message: "Chat OK" });
        })
        .catch((err) => {
          console.log(err);

          res.status(400);
        });
    }
  } catch (error) {
    res.status(400);
  }
});
app.post("/chat-file/:roomID", async (req, res) => {});

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
