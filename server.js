/** @format */
const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Upload, getS3url } = require("./s3");
const {
    // pullImages,
    getImages,
    insertImage,
    getImageById,
    getCommentsByImageId,
    addCommentToImage,
} = require("./db");

const app = express();

app.use(express.static("./public"));
app.use(express.json());

// multer setup
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.post(
    "/upload",
    uploader.single("image"),
    s3Upload,
    function (request, res) {
        console.log("[upload] button clicked");
        if (request.file) {
            console.log(request.file, request.body);
            const url = getS3url(request.file.filename);
            insertImage({ url, ...request.body }).then((image) => {
                res.json(image);
            });
            return;
        }
        res.statusCode = 500;
        res.json({
            success: false,
        });
    }
);

app.get("/images.json", (request, response) => {
    const { limit, page } = request.query;
    getImages({
        limit,
        page,
    })
        .then((images) => response.json(images))
        .catch((error) => {
            console.log("[imageboard:express]", error);
            response.statusCode = 500;
            response.json({
                message: "Error getting images",
            });
        });
});

app.get("/images/:id", (request, response) => {
    const { id } = request.params;

    getImageById(id).then((image) => {
        response.json(image);
    });
});

app.get("/images/:image_id/comments", (request, response) => {
    const { image_id } = request.params;
    getCommentsByImageId(image_id).then((comments) => response.json(comments));
});

app.post("/images/:image_id/comments", (request, response) => {
    console.log("test");
    const { image_id } = request.params;
    addCommentToImage({ image_id, ...request.body }).then((comment) => {
        response.json(comment);
    });
    return;
});

// keep last generic routing
app.get("*", (request, response) => {
    response.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
