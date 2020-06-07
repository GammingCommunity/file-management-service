const { uploader } = require("cloudinary").v2;

const uploadImage = async (file, ID, type) => {
  var resultUrl = "";
  return uploader
    .upload(file, {
      tags: ID, overwrite: true, use_filename: true, resource_type: "auto" ,unique_filename:false,
      folder: type == "room" ? "group-media/" + ID : "chat-media/" + ID,
    })
    .then((result) => {
      resultUrl = result.url;
      return {
        url: resultUrl,
        height: result.height,
        width: result.width,
        format: result.format,
        publicID:result.public_id
      };
    }).catch((err) => {
      console.log(err);
      
    });
};
module.exports = uploadImage;
