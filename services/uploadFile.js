const { uploader } = require("cloudinary").v2;

const uploadFile = async (file, ID, type,fileName) => {
    var resultUrl = "";
    return uploader
        .upload(file, {
            tags: ID,
            //overwrite:false,
            use_filename: true,
            resource_type: "auto",
            unique_filename: false,
            //public_id: fileName,
            folder: type == "room"
                ? "group-file/" + ID
                : "chat-file/" + ID,
        })
        .then((result) => {
            resultUrl = result.url;
            return {
                url: resultUrl,
                name:fileName,
                size:result.bytes,
                height: result.height,
                width: result.width,
                format: result.format,
                publicID: result.public_id,
                
            };
        }).catch((err) => {
            console.log(err);

        });
};
module.exports = uploadFile;
