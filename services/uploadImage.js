const { uploader } = require("cloudinary").v2;

const uploadImage = async (file, ID, type) => {
  var resultUrl = "";
  return uploader
    .upload(file, {
      tags: ID,
      folder: type == "room" ? "group-media/" + ID : "chat-media/" + ID,
    })
    .then((result) => {
      resultUrl = result.url;
      return {
        url: resultUrl,
        height: result.height,
        width: result.width,
      };
    });
};
module.exports = uploadImage;
