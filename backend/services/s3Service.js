const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const { Readable } = require("stream");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadJsonToS3 = async (data, folder = "backups") => {
  const fileName = `${folder}/backup-${new Date().toISOString().split("T")[0]}-${uuidv4()}.json`;

  const buffer = Buffer.from(JSON.stringify(data, null, 2));

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: "application/json"
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return fileName; // ניתן להשתמש בו ליצירת קישור הורדה בעתיד
};

module.exports = {
  uploadJsonToS3
};
