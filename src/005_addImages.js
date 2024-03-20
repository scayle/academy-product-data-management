// Reads the images from the data/images folder and uploads them to the Scayle Admin API
const SwaggerClient = require("swagger-client");
const fs = require("fs/promises");
require("dotenv").config();

async function uploadImages() {
  const client = await new SwaggerClient({
    url: `https://${process.env.TENANT_KEY}.admin.api.scayle.cloud/api/admin/v1/admin-api.json`,
    authorizations: {
      accessToken: {
        value: process.env.ADMIN_API_TOKEN,
      },
    },
  });

  const path = "./data/images";
  const files = await fs.readdir(path, {
    withFileTypes: true,
  });

  // Filter out files and keep directories
  const directories = files.filter((file) => file.isDirectory());

  // Log directory names
  directories.forEach(async (directory) => {
    const referenceKey = directory.name;
    const images = await fs.readdir(`${path}/${referenceKey}`, {
      withFileTypes: true,
    });
    images.forEach(async (image) => {
      if (image.name === ".DS_Store") return;

      const imageFile = await fs.readFile(
        `${path}/${referenceKey}/${image.name}`
      );
      const base64Image = imageFile.toString("base64");
      const newImage = {
        source: {
          attachment: base64Image,
        },
      };
      try {
        // @ts-ignore
        const response = await client.apis.Images.createProductImage(
          { productIdentifier: `key=${referenceKey}` },
          { requestBody: newImage }
        );
        const createdImage = response.body;
        console.log("Created Image", createdImage);
      } catch (e) {
        console.log("Unable to upload image", e);
      }
    });
  });
}

uploadImages();
