/** @format */
const spicedPg = require("spiced-pg");
const db = spicedPg(getDatabaseURL());

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { db_user, db_pass, db_name } = require("./secrets.json");
    return `postgres:${db_user}:${db_pass}@localhost:5432/${db_name}`;
}

//database function//
/* ---------------- */

function pullImages() {
    console.log("[notification] pullImages function");
    return db
        .query(`SELECT * FROM images ORDER BY id DESC`)
        .then((result) => result.rows);
}

function getImages({ limit, page }) {
    return db
        .query(
            `
        SELECT * FROM images
        ORDER BY id DESC LIMIT $1 OFFSET $2
    `,
            [limit, limit * (page - 1)]
        )
        .then((result) => result.rows);
}

function getImageById(id) {
    return db
        .query("SELECT * FROM images WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}

function getCommentsByImageId(image_id) {
    return db
        .query("SELECT * FROM comments where image_id = $1", [image_id])
        .then((result) => result.rows);
}

function addCommentToImage({ username, image_id, text }) {
    return db
        .query(
            `
            INSERT INTO comments (username, image_id, text)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
            [username, image_id, text]
        )
        .then((result) => result.rows[0]);
}

function insertImage({ title, description, username, url }) {
    return db
        .query(
            `
            INSERT INTO images (title, description, username, url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
            [title, description, username, url]
        )
        .then((result) => result.rows[0]);
}
function test() {
    console.log("test");
}

module.exports = {
    pullImages,
    getImages,
    insertImage,
    getImageById,
    getCommentsByImageId,
    addCommentToImage,
    test,
};
