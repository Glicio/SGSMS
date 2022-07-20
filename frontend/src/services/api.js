const axios = require("axios");

const api = axios.create({
  baseURL: "http://192.168.1.69:3030/",
  timeout: 30000,
});

module.exports = api;
