const { uploader } = require("cloudinary").v2;

const uploadPostMedia = async (file, ID, type, fileName) => {
    var resultUrl = "";
    return uploader
        .upload(file, {
            tags: type ==" user" ? "user-post" : "group-post",

            use_filename: true,
            resource_type: "auto",
            unique_filename: false,
            public_id: fileName,

            folder: type == "user"
                ? "user-post/" + ID
                : "group-post/" + ID

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
module.exports = uploadPostMedia;
