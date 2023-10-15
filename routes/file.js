const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const shortId = require('shortid');
const { Readable } = require('readable-stream');

const region = "us-east-1";
const accessKeyId = "AKIAQ3GJR26LCSV2VLUJ";
const secretAccessKey = "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";
const bucketName = "userimagebucket-web";

let s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = shortId.generate() + '-' + file.originalname;
      cb(null, fileName);
      req.uploadedFileName = fileName;
    },
  }),
});

router.post('/uploads', upload.single('file'), (req, res) => {
  try {
    const fileName = req.uploadedFileName;
    res.json({ message: 'File uploaded successfully', fileName: fileName });
  } catch (err) {
    res.send(err.message);
  }
});

router.get('/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const bucketName = 'userimagebucket-web';

    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await s3.send(command);

      if (response.Body) {
        const data = await response.Body.transformToByteArray();
        const buffer = Buffer.from(data);

        res.attachment(fileName).contentType("image/png").send(buffer);
      } else {
        return res.status(404).json({ message: 'File not found' });
      }
    } catch (error) {
      return res.send(error.message);
    }
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
