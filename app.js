const express = require("express");
const multer = require("multer");
const app = express();
// geting the crpto things
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib"); // for compression and decompressing
const AppendInitVect = require("./appendInitVect"); // adding the init vector
const { getCipherKey } = require("./util");
// for steam making
const stream = require("stream");

// making the aws things
const AWS = require("aws-sdk");

AWS.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
});

const s3 = new AWS.S3();

// uploading stream to aws
function uploadFromStream(s3, filename) {
  var pass = new stream.PassThrough();
  var params = {
    Bucket: process.env.bucket,
    Key: filename,
    Body: pass,
  };
  // Callback is must
  s3.upload(params, function (err, data) {
    console.log(err, data);
  });
  return pass;
}

// multer thing for getting the req.file
const getFile = multer({
  limits: { fileSize: 5000000 },
});

// making read stream from file so that the encrption can be done
function bufferToStream(myBuuffer) {
  let tmp = new stream.Duplex();
  tmp.push(myBuuffer);
  tmp.push(null);
  return tmp;
}

// for api things
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// for handling the req
app.post("/", getFile.single("image"), async (req, res, next) => {
  const initVect = crypto.randomBytes(16); // making the init vector
  const CIPHER_KEY = getCipherKey(req.body.password); // making the cyper key from password
  const readStream = bufferToStream(req.file.buffer); // makking the read Stream from the file buffer
  const gzip = zlib.createGzip(); // for compression of the file
  const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, initVect); // for the encrption
  const appendInitVect = new AppendInitVect(initVect); // for adding the init vector in the start of the cipher file
  await readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(uploadFromStream(s3, req.body.filename));
  res.status(200).json({ success: true });
  /**
   * when not using aws and have file locally
   *
   * const writeStream = fs.createWriteStream(path.join('ripu' + process.env.ENCRYPED_EXT));
   *  readStream.pipe(gzip)
   *   .pipe(cipher)
   *   .pipe(appendInitVect)
   *   .pipe(writeStream);
   *
   */
});

app.get("/", async (req, res, next) => {
  var params = { Bucket: process.env.bucket, Key: req.body.filename };
  var re = await read(params);
  const CIPHER_KEY = getCipherKey(req.body.password);
  const readStream = bufferToStream(re.Body.slice(16));
  const decipher = crypto.createDecipheriv(
    process.env.ALGORITHM,
    CIPHER_KEY,
    re.Body.slice(0, 16)
  );
  const unzip = zlib.createUnzip();
  readStream.pipe(decipher).pipe(unzip).pipe(res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is up at 3000");
});
