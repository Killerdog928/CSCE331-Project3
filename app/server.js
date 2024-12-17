const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const OAUTH_CONFIG = {
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: isProduction
    ? process.env.REDIRECT_URI_PROD
    : process.env.REDIRECT_URI_LOCAL,
};

app.use(cors());
app.use(express.json());

app.post("/exchange-token", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(OAUTH_CONFIG.tokenEndpoint, null, {
      params: {
        client_id: OAUTH_CONFIG.clientId,
        client_secret: OAUTH_CONFIG.clientSecret,
        code,
        redirect_uri: OAUTH_CONFIG.redirectUri,
        grant_type: "authorization_code",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error exchanging token:", error.response?.data);
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


