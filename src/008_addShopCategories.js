// 1. Add Pants and Shoes shop category
// 2. Add Sale Category
const SwaggerClient = require("swagger-client");
require("dotenv").config();

async function createShopCategories() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const categoryTrees = [
    [
      {
        parentId: null,
        name: {
          de_DE: "Women",
        },
        isActive: true,
        isVisible: true,
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Women"],
              },
            ],
          },
        ],
      },
      {
        parentId: null,
        name: {
          de_DE: "Shoes",
        },
        isActive: true,
        isVisible: true,
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Women|Shoes"],
              },
            ],
          },
        ],
      },
      {
        parentId: null,
        name: {
          de_DE: "High Heels",
        },
        isActive: true,
        isVisible: true,
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Women|Shoes"],
              },
              {
                name: "heelHeight",
                include: ["High"],
              },
            ],
          },
        ],
      },
    ],
    [
      {
        parentId: null,
        name: {
          de_DE: "Men",
          en_GB: "Men",
        },
        isActive: true,
        isVisible: true,
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Men"],
              },
            ],
          },
        ],
      },
      {
        parentId: null,
        name: {
          de_DE: "Clothing",
          en_GB: "Clothing",
        },
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Men|Clothing"],
              },
            ],
          },
        ],
        isActive: true,
        isVisible: true,
      },
      {
        parentId: null,
        name: {
          de_DE: "Pants",
          en_GB: "Pants",
        },
        productSets: [
          {
            attributes: [
              {
                name: "category",
                include: ["Men|Clothing|Pants"],
              },
            ],
          },
        ],
        isActive: true,
        isVisible: true,
      },
    ],
  ];

  for (let categoryTree of categoryTrees) {
    let parentID = null;
    for (let category of categoryTree) {
      category.parentId = parentID;
      try {
        // @ts-ignore
        const response = await client.apis.ShopCategories.createShopCategory(
          { shopKey: "ms" },
          { requestBody: category }
        );
        const createdShopCategory = response.body;
        parentID = createdShopCategory.id;
        console.info("Created Category", createdShopCategory);
      } catch (error) {
        console.error(
          "Unable to create shop category",
          error.response.body.errors
        );
      }
    }
  }
}
createShopCategories();
