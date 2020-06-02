const { uploader } = require('cloudinary').v2;

const uploadImage= async (file,roomID,type)=>{
    var resultUrl = '';
    return uploader.upload(file, {
        tags: roomID,
        folder: "group-media/" + roomID,
    }).then((result) => {
        
        resultUrl = result.url;
        return {
            "url": resultUrl,
            "height":result.height,
            "width":result.width,

        };
    })
}
module.exports = uploadImage;