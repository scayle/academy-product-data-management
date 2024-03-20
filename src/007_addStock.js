// Adds stock to the variants we've created in the previous step

const SwaggerClient = require("swagger-client");
require("dotenv").config();

const Papa = require("papaparse");
const fs = require("fs/promises");

async function addStock(client, data) {
  let newStock = {
    quantity: parseInt(data.quantity, 10),
    warehouseReferenceKey: data.warehouseReferenceKey,
    changedAt: "2024-01-26T00:00:00+00:00",
    merchantReferenceKey: "default",
  };

  try {
    let response = await client.apis.Stocks.createProductVariantStock(
      { variantIdentifier: `key=${data.variantReferenceKey}` },
      { requestBody: newStock }
    );

    let createdStock = response.body;
    console.log("Created Stock", createdStock);
  } catch (e) {
    console.error("Unable to add stock to variant", e);
  }
}

async function importStock() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const data = await fs.readFile("./data/stock.csv", "utf8");
  const results = Papa.parse(data, {
    header: true,
  });

  for (const stock of results.data) {
    addStock(client, stock);
  }
}

importStock();
