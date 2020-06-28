const { uploader } = require('cloudinary').v2;

const uploadGroupProfile = async (file, roomID, type,fileName) => {    
    var resultUrl = '';
    return uploader.upload(file, {
        tags: roomID,
        use_filename: true,
        resource_type: "auto",
        unique_filename: false,
        folder: "group-profile/" + roomID,
    }).then((result) => {
        
        
        return {
            url: result.url,
            name: fileName,
            size: result.bytes,
            height: result.height,
            width: result.width,
            format: result.format,
            publicID: result.public_id,

        };
    })
}
module.exports = uploadGroupProfile;