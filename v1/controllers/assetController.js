const AWS = require('aws-sdk'); // Requiring AWS SDK.

// Configuring AWS
AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_KEY, // stored in the .env file
  secretAccessKey: process.env.AWS_SECRET, // stored in the .env file
  region: process.env.CATALOG_BUCKET_REGION, // This refers to your bucket configuration.
});

// Creating a S3 instance
const s3 = new AWS.S3();

// Retrieving the bucket name from env variable
const Bucket = process.env.CATALOG_BUCKET_NAME;

//upload catalog assets
async function generatePutUrl(req,res){
  try {
    const { Key, ContentType } = req.body;
    const params = {
      Bucket: Bucket,
      Key:Key,
      ContentType: ContentType,
      ACL: "public-read",
    };
    s3.getSignedUrl("putObject", params, function (err, url) {
      if (err) {
        return res.status(400).json({ message: err });
      }
      // If there is no errors we can send back the pre-signed PUT URL
      return res.json({ data: url });
    });
    
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  generatePutUrl,
};
