/** @format */

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.aws_key_id,
    secretAccessKey: secrets.aws_key_secret,
});

function s3Upload(request, response, next) {
    if (!request.file) {
        console.log("No req.file!");
        return response.sendStatus(500);
    }
    const { filename, mimetype, size, path } = request.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then(() => {
            // it worked!!!
            next();
        })
        .catch((err) => {
            // uh oh
            console.log(err);
            response.sendStatus(500);
        });
}

function getS3url(fileName) {
    return `https://spicedling.s3.amazonaws.com/${fileName}`;
}

module.exports = {
    s3Upload,
    getS3url,
};
