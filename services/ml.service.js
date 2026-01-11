const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

const callMLService = async (payload) => {
  try {
    // Pass payload directly to Python Service
    const response = await axios.post(`${ML_URL}/predict`, payload);
    return response.data;
  } catch (error) {
    console.error("ML Service Connection Error:", error.message);
    if (error.response) {
      console.error("ML Service Response:", error.response.data);
    }
    throw new Error("ML Service prediction failed");
  }
};

module.exports = { callMLService };