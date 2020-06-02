const fs = require('fs');
const { uploader } = require('cloudinary').v2;
const processUpload = async (file, userID) => {
    /* =const { filename, mimetype, createReadStream } = await file;
    // var readStream = fs.createReadStream(file);
     var stream = createReadStream();*/
   // var stream = fs.createReadStream(file);
    let resultUrl = '';
   
    return uploader.upload(file, {
        tags: "avatar",
        folder: "avatar/" + userID,
    }).then((result) => {
        resultUrl = result.url;
        return resultUrl;
    })
    /*const cloudinaryUpload = async ({ stream }) => {
        try {
            await new Promise((resolve, reject) => {
                const streamUpload = cloudinary.uploader.upload(file,
                    {
                        tags: "avatar",
                        folder: "avatar/" + userID,
                    },
                    (err, result) => {
                        //console.log(result);
                        
                        if (result) {
                            resultUrl = result.url;
                            resolve(resultUrl);
                        }
                        else {
                            reject(err);
                        }
                    });
                stream.pipe(streamUpload);
            })
        } catch (error) {
            return null;

        }
    }
    await cloudinaryUpload({ stream });*/
    //return resultUrl;
    //return { "code": "200", "success": true, message: "Upload success", "image_url": resultUrl };
}
module.exports = processUpload