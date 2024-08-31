const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/customError');
const util = require('util');
const path = require('path');
const { uploadFile, getFileStream }  = require('./../utils/s3');



exports.postImage = asyncErrorHandler(async (req, res, next) => {
    
    console.log("Post image called");
    const imageFile = req?.files?.['image'] || null;

    // check expected file type and size
    if(!imageFile){
        console.log("No image file");
        return next(new CustomError('Please upload an image', 400));
    } else if(!imageFile.mimetype.startsWith('image')){
        console.log("Invalid image file type");
        return next(new CustomError('Invalid Image file. Please upload an image', 400));
    }

    const result = await uploadFile(imageFile);

    console.log(result);
     
    return res.status(200).json({
        status: 'success',
        message: 'Image uploaded successfully',
        key: result.Key
    });
});

exports.getImages = asyncErrorHandler(async (req, res, next) => {
    return res.status(400).json({
        status: 'failed',
        message: 'please use post request'
    })
});

exports.getImage = asyncErrorHandler(async (req, res, next) => {
    const { key } = req.params;

    if(key == 'favicon.ico'){
        return;
    }

    const extention_file = path.extname(key);
    console.log(extention_file);



    var content_type = 'image/jpeg';

    if(extention_file == '.png'){
        content_type = 'image/png';        
    } else if(extention_file == '.jpg'){
        content_type = 'image/jpeg';        
    } else if(extention_file == '.jpeg'){
        content_type = 'image/jpeg';        
    }else if(extention_file == '.gif'){
        content_type = 'image/gif';
    } else if(extention_file == '.pdf'){
        content_type = 'application/pdf';
    }


    
    const readStream = await getFileStream(key);
    console.log("Reading Stream");
    if(readStream == null){
        console.log('File not found from imagecontroller');
        return res.redirect('/');
    }

    res.setHeader('Content-Type', content_type);
    
    return readStream.pipe(res);
});
