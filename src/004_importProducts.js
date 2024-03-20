const SwaggerClient = require("swagger-client");
require("dotenv").config();

const Papa = require("papaparse");
const fs = require("fs/promises");

function getMaterialComposition(materialCompositionStr) {
  const regex = /(\d+)(\D+)\s(\w+)/;
  const parts = materialCompositionStr.split(",");

  const result = [];
  for (let part of parts) {
    let match = part.match(regex);

    if (match) {
      let fraction = parseInt(match[1], 10);
      let unit = match[2].trim();
      let material = match[3];
      result.push({ fraction, unit, material });
    }
  }
  return result;
}

async function deleteProduct(client, data) {
  try {
    let response = await client.apis.Products.deleteProduct({
      productIdentifier: `key=${data.referenceKey}`,
    });
    console.info(`Deleted product with reference key ${data.referenceKey}`);
  } catch (error) {
    console.error("Unable to delete product", error.response.body.errors);
  }
}

// Create a product according to the documentation found here: https://scayle.dev/en/dev/admin-api/create-product
// Learn more about the product structure here: https://scayle.dev/en/dev/admin-api/product-overview
async function createProduct(client, data) {
  const newProduct = {
    referenceKey: data.referenceKey,
    name: {
      de_DE: data.name, // We assume here that the name will work for all languages
    },
    state: "live", // live or draft
    master: {
      referenceKey: data.masterReferenceKey, // Usually we would receive a master key and not set it like this
      categories: {
        paths: [data.categories.split(",")], // These categories need to be defined beforehand
      },
      attributes: [
        {
          name: "countryOfOrigin", // This attribute group needs to be present
          type: "simple",
          value: data.countryOfOrigin, // these attribute values will automatically be created if they don't exist
        },
        {
          name: "washingInstructions",
          type: "localizedStringList",
          value: data.washingInstructions.split(",").map((instruction) => {
            return {
              de_DE: instruction,
            };
          }),
        },
        {
          name: "materialCompositionAdvanced",
          type: "advanced",
          value: {
            components: getMaterialComposition(data.materialComposition),
          },
        },
      ],
    },
    attributes: [
      {
        name: "color",
        type: "localizedString",
        value: {
          de_DE: data.color,
        },
      },
    ],
  };

  if (data.heelHeight != "null") {
    newProduct.master.attributes.push({
      name: "heelHeight",
      type: "simple",
      value: data.heelHeight,
    });
  }

  try {
    let response = await client.apis.Products.createProduct(
      {},
      { requestBody: newProduct }
    );
    let createdProduct = response.body;
    console.log("Created Product:", createdProduct);
  } catch (error) {
    console.error("Unable to create product", error.response.body.errors);
  }
}

// Import products from our products.csv file
// The CSV is simplified. In a production import you would probably have a different way of importing the data from your system.
// This is a general demonstration on how to use the Admin API to create products in SCAYLE.
async function importProducts() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const data = await fs.readFile("./data/products.csv", "utf8");
  const results = Papa.parse(data, {
    header: true,
  });
  for (const product of results.data) {
    createProduct(client, product);
  }
}

importProducts();
