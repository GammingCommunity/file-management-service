const { uploader } = require("cloudinary").v2;

const uploadMedia = async (file, ID, type,fileName) => {
  var resultUrl = "";
  return uploader
    .upload(file, {
      tags: ID,
      
      use_filename: true,
      resource_type: "auto",
      unique_filename: false,
      //public_id: fileName,

      folder: type == "room"
        ? "group-media/" + ID
        : "chat-media/" + ID,
    })
    .then((result) => {
      
      return {
        url: result.url,
        name: fileName,
        size: result.bytes,
        height: result.height,
        width: result.width,
        format: result.format,
        publicID: result.public_id,
      };
    }).catch((err) => {
      console.log(err);
      
    });
};
module.exports = uploadMedia;
