import axios from "axios";

/**
 * Exchanges an authorization code for an access token using Google's OAuth 2.0 API.
 *
 * @param code - The authorization code received from the OAuth 2.0 provider.
 * @returns A promise that resolves to an object containing the access token.
 *
 * @throws Will throw an error if the token exchange fails.
 *
 * @example
 * ```typescript
 * const tokenResponse = await exchangeToken('authorization_code');
 * console.log(tokenResponse.access_token);
 * ```
 */
export const exchangeToken = async (
  code: string,
): Promise<{
  access_token: string;
}> => {
  const clientId =
    "548903282497-hpnjaq6ed86tqiuiv1fjpka7usa4tc6s.apps.googleusercontent.com"; // Google Client ID
  const clientSecret = "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"; // Google Client Secret

  // Determine the redirect URI based on the environment
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? "https://project-3-24-cracked-donkeys.vercel.app/callback" // Deployed Callback URI
      : "http://localhost:3000/callback"; // Local Callback URI

  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        },
      },
    );

    return response.data; // Access token and additional data
  } catch (error: any) {
    console.error("Error during token exchange:", {
      response: error.response?.data,
      status: error.response?.status,
      message: error.message,
      stack: error.stack,
    });
    throw error; // Propagate error to the caller
  }
};
