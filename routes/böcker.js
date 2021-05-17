const express = require("express");
const route = express.Router();

const hämtaBöcker = (res, req) => {
  console.log("Här kommer boklistan");
};

route.get("/böcker", hämtaBöcker);

module.exports = route;
