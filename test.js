/** @format */

const { getImageById } = require("./db");

getImageById(5).then((results) => console.log(results));
