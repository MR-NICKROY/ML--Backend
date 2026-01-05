const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL;

const callMLService = async (payload) => {
  const response = await axios.post(`${ML_URL}/predict`, payload);
  return response.data;
};

module.exports = { callMLService };
