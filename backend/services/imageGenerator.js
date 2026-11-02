const axios = require("axios");

async function generateImage(prompt) {
  try {
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(
      prompt
    )}`;

    const response = await axios.get(imageUrl, {
      params: {
        model: "flux",
        width: 1024,
        height: 1024,
        nologo: true,
      },
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}`,
      },
      responseType: "arraybuffer",
      timeout: 120000,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Pollinations Error:",
      error.response?.status,
      error.message
    );
    return null;
  }
}

module.exports = generateImage;