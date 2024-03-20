const SwaggerClient = require("swagger-client");
require("dotenv").config();

// Making sure that you can connect to the Admin API
// Hint: It might be, that this call returns an empty list, as we didn't create any shops yet.
// We just care about the response code.
async function validateConnection() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN, // Your Admin API Token, you can find it in the SCAYLE Admin UI. Update it in the .env file
      },
    },
  });

  try {
    // @ts-ignore
    const response = await client.apis.Shops.getShops();
    if (!response.ok) {
      console.error("Unable to fetch shops, please contact your CSM.");
      return;
    }
    console.info("Successfully connected to the Admin API.");
  } catch (e) {
    console.error(
      "Unable to connect to the Admin API. Please check your credentials."
    );
  }
}

validateConnection();
