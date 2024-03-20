// 1. Create Color // localizedString product
// 2. Create Size // localizedString variant
// 3. materialComposition // advanced product
// 4. Heel Height // simple product
// 5. Country of origin // simple master
// 6. Washing instructions // localizedStringList master
// Missing: simpleList, localizedStringList

const SwaggerClient = require("swagger-client");
require("dotenv").config();

async function createAttributeGroups() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const attributes = [
    {
      name: "size",
      frontendName: {
        de_DE: "Size",
      },
      type: "localizedString", // single select attribute. A product can only have one value for this attribute at a time.
      level: "variant", // Where this attribute is used. Can be master, product or variant
      isDifferentiating: true, // This attribute differentiates between different variants. No two variants can have the same value for this attribute.
      isShared: true,
    },
    {
      name: "color",
      frontendName: {
        de_DE: "Color",
      },
      type: "localizedString",
      level: "product",
      isDifferentiating: true,
      isShared: true,
    },
    {
      name: "heelHeight",
      frontendName: {
        de_DE: "Heel Height",
      },
      type: "simple",
      level: "master",
      isDifferentiating: false,
      isShared: true,
    },
    {
      name: "washingInstructions",
      frontendName: {
        de_DE: "Washing instructions",
      },
      isShared: true,
      type: "localizedStringList",
      level: "master",
      isDifferentiating: false,
    },
    {
      name: "countryOfOrigin",
      frontendName: {
        de_DE: "Country of Origin",
      },
      type: "simple",
      level: "master",
      isDifferentiating: false,
      isShared: true,
    },
    // Attributes for our AdvancedAttribute
    {
      name: "unit",
      frontendName: {
        de_DE: "Unit",
      },
      type: "simple",
      level: "product",
      isDifferentiating: false,
      isShared: true,
    },
    {
      name: "material",
      frontendName: {
        de_DE: "Material",
      },
      type: "localizedString",
      level: "product",
      isDifferentiating: false,
      isShared: true,
    },
    // Attribute that will allow us to save material composition that looks similar to this: 60% cotton, 40% polyester
    {
      name: "materialCompositionAdvanced",
      frontendName: {
        de_DE: "Material Composition",
      },
      type: "advanced",
      level: "master",
      isShared: false,
      isDifferentiating: false,
      structure: {
        components: {
          type: "array", // In components we should find a list of objects
          items: {
            fraction: {
              type: "integer", // Simple integer for the first part of
            },
            unit: {
              // Unit of the fraction, might be % or gram or something else
              type: "attributeGroup",
              attributeGroupName: "unit",
            },
            material: {
              // Material of the fraction, might be cotton, polyester or something else
              type: "attributeGroup",
              attributeGroupName: "material",
            },
          },
        },
      },
    },
  ];

  for (const attribute of attributes) {
    try {
      // @ts-ignore
      const response = await client.apis.AttributeGroups.createAttributeGroup(
        {},
        { requestBody: attribute }
      );
      const createdAttributeGroup = response.body;
      console.log(createdAttributeGroup);
    } catch (error) {
      console.error(
        "Unable to create attribute group",
        error.response.body.errors
      );
    }
  }
}
createAttributeGroups();
