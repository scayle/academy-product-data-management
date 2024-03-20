// This script will add variants to the products we created in the previous step. The variants are defined in a CSV file and will be imported into the system.
const SwaggerClient = require("swagger-client");
require("dotenv").config();

const Papa = require("papaparse");
const fs = require("fs/promises");

async function createVariant(client, data) {
  let newProductVariant = {
    referenceKey: data.referenceKey,
    attributes: [
      {
        name: "size",
        type: "localizedString",
        value: {
          de_DE: data.size,
        },
      },
    ],
    prices: [
      {
        price: parseInt(data.price, 10),
        tax: parseInt(data.tax, 10),
        currencyCode: data.currencyCode,
        countryCode: data.countryCode,
        oldPrice: parseInt(data.oldPrice),
        recommendedRetailPrice: parseInt(data.recommendedRetailPrice, 10),
        validFrom: "2024-01-26T00:00:00+00:00",
        validTo: null,
      },
    ],
  };

  try {
    const response = await client.apis.Variants.createProductVariant(
      { productIdentifier: `key=${data.productReferenceKey}` },
      { requestBody: newProductVariant }
    );
    const createdProductVariant = response.body;
    console.log("Created Product Variant", createdProductVariant);
  } catch (e) {
    console.log("Unable to create product variant", e);
  }
}

async function importVariants() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const data = await fs.readFile("./data/variants.csv", "utf8");
  const results = Papa.parse(data, {
    header: true,
  });

  for (const variant of results.data) {
    createVariant(client, variant);
  }
}

importVariants();
