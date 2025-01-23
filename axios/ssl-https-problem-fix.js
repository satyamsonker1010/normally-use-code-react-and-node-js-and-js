const AWS = require("aws-sdk");
const { default: axios } = require("axios");
const dotenv = require("dotenv");
const crypto = require("crypto");
const https = require('node:https');

// In nodejs 18 version some api request not call if we use https protocall.
// This is the one solution that call https protocal apis for 18 or less versions

try {
    const postData = {};
    const url = `url`;
    const agent = new https.Agent({
      secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    });

    axios
      .post(url, postData, { httpsAgent: agent })
      .then((response) => {
        console.log("Response data:", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error", error);
  }
