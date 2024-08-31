require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const crypto = require('crypto');

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const bucketUrl = process.env.BUCKET_URL;


// Connect to S3
const s3 = new S3({
    endpoint: bucketUrl, 
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    s3BucketEndpoint: true
});

// uploads a file to s3
function uploadFile(file){
    const { name, mimetype, size, data } = file;
    const id = crypto.randomBytes(16).toString('hex');
    const fileName = `${id}-${name}`;
    const fileContent  = Buffer.from(data, ' ');
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ContentType: mimetype,
        ContentLength: size
    };

    return s3.upload(params).promise();
}

exports.uploadFile = uploadFile;


// downloads a file from s3
async function getFileStream(fileKey){
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    var fileAvailability = await checkFileAvailibility(downloadParams);
    console.log(fileAvailability);
    
    if(!fileAvailability){
        console.log('Returning null');
        return null;
    } else{
        return s3.getObject(downloadParams).createReadStream();
    }
  }

  async function checkFileAvailibility(downloadParams){
    console.log("checkFileAvailibility called");

    try{
        await s3.headObject(downloadParams).promise();
        return true;
    }catch(err){
        console.log('Error in checkFileAvailibility');
        return false;
    }

  }
 
  exports.getFileStream = getFileStream
