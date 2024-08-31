const asyncErrorHandler = require('./../utils/asyncErrorHandler');
const CustomError = require('./../utils/customError');
const util = require('util');
const path = require('path');
const { uploadFile, getFileStream }  = require('./../utils/s3');



exports.postMap = asyncErrorHandler(async (req, res, next) => {
    
    console.log("Post map called");
    const mapFile = req?.files?.['map'] || null;

    // check expected file type and size
    if(!mapFile){
        console.log("No Map file");
        return next(new CustomError('Please upload an map', 400));
    }

    const result = await uploadFile(mapFile);

    console.log(result);
     
    return res.status(200).json({
        status: 'success',
        message: 'Map uploaded successfully',
        key: result.Key
    });
});

exports.getMaps = asyncErrorHandler(async (req, res, next) => {
    return res.status(400).json({
        status: 'failed',
        message: 'please use post request'
    })
});

exports.getMap = asyncErrorHandler(async (req, res, next) => {
    const { key } = req.params;

    if(key == 'favicon.ico'){
        return;
    }

    const extention_file = path.extname(key);
    console.log(extention_file);



    var content_type = 'application/vnd.mapforge.map';

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
        console.log('File not found from mapcontroller');
        return res.redirect('/');
    }

    res.setHeader('Content-Type', content_type);
    
    return readStream.pipe(res);
});
