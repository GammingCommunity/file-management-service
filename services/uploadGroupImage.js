const { uploader } = require('cloudinary').v2;

const uploadGroupImage = async (file, roomID, type) => {
    console.log(type);
    
    var resultUrl = '';
    return uploader.upload(file, {
        tags: roomID,
        folder: "group-profile/" + roomID +"/"+ type,
    }).then((result) => {
        
        resultUrl = result.url;
        return {
            "url": resultUrl,
            "height":result.height,
            "width":result.width,

        };
    })
}
module.exports = uploadGroupImage;