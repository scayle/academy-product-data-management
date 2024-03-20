// 1. Create Female Shoes
// 2. Create Male Pants
const SwaggerClient = require("swagger-client");
require("dotenv").config();

async function createMasterCategories() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const masterCategoriesList = [
    [
      {
        path: ["Men"],
        attributes: [
          {
            name: "countryOfOrigin",
            type: "simple",
            isMandatory: true,
          },
        ],
      },
      {
        path: ["Men", "Clothing"],
      },
      {
        path: ["Men", "Clothing", "Pants"], // We don't need to define mandatory attributes here, as this has been covered by the Clothing Category
        attributes: [
          {
            name: "materialCompositionAdvanced",
            type: "advanced",
            isMandatory: true,
          },
        ],
      },
    ],
    [
      {
        path: ["Women"],
        attributes: [
          {
            name: "countryOfOrigin",
            type: "simple",
            isMandatory: true,
          },
        ],
      },
      {
        path: ["Women", "Shoes"],
        attributes: [
          {
            name: "materialCompositionAdvanced",
            type: "advanced",
            isMandatory: true,
          },
        ],
      },
    ],
  ];

  for (let masterCategories of masterCategoriesList) {
    for (const masterCategory of masterCategories) {
      try {
        const response =
          // @ts-ignore
          await client.apis.MasterCategories.createMasterCategory(
            {},
            { requestBody: masterCategory }
          );
        const createdMasterCategory = response.body;
        console.log(createdMasterCategory);
      } catch (error) {
        console.error(
          "Unable to create master category",
          error.response.body.errors
        );
      }
    }
  }
}

createMasterCategories();
