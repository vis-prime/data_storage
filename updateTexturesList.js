const fs = require("fs")
const path = require("path")

// Define the root folder and output file
const rootDir = path.join(__dirname, "/textures")
const outputFile = path.join(__dirname, "textureList.json")

// Function to scan a directory and generate the texture list
function generateTextureList(folderPath) {
  const textureList = {}

  // Get all subdirectories in the folder
  const subfolders = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  // Iterate over each subfolder
  subfolders.forEach((subfolder) => {
    const subfolderPath = path.join(folderPath, subfolder)
    const files = fs.readdirSync(subfolderPath)

    const textures = {}

    const diffuseKeyWords = ["basecolor", "diffuse"]
    const normalKeyWords = ["normal"]
    const roughnessKeyWords = ["rough"]
    const metallicKeyWords = ["metal"]
    const aoKeyWords = ["ao", "occ"]

    const KEYS = {
      DIFFUSE: "diffuse",
      NORMAL: "normal",
      ROUGHNESS: "rough",
      METALLIC: "metal",
      AO: "ao", // Ambient Occlusion
      ORM: "occ_rough_metal", // Occlusion, Roughness, Metallic
      OR: "occ_rough", // Occlusion, Roughness
      RM: "rough_metal", // Roughness, Metallic
      OM: "occ_metal", // Occlusion, Metallic
    }

    // Sort files into texture types based on keywords
    files.forEach((file) => {
      const lowerCaseFile = file.toLowerCase()
      if (diffuseKeyWords.some((keyword) => lowerCaseFile.includes(keyword))) {
        textures[KEYS.DIFFUSE] = file
      } else if (
        normalKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.NORMAL] = file
      }

      // orm
      if (
        aoKeyWords.some((keyword) => lowerCaseFile.includes(keyword)) &&
        roughnessKeyWords.some((keyword) => lowerCaseFile.includes(keyword)) &&
        metallicKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.ORM] = file
      } else if (
        aoKeyWords.some((keyword) => lowerCaseFile.includes(keyword)) &&
        roughnessKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.OR] = file
      } else if (
        roughnessKeyWords.some((keyword) => lowerCaseFile.includes(keyword)) &&
        metallicKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.RM] = file
      } else if (
        aoKeyWords.some((keyword) => lowerCaseFile.includes(keyword)) &&
        metallicKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.OM] = file
      } else if (
        roughnessKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.ROUGHNESS] = file
      } else if (
        metallicKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.METALLIC] = file
      } else if (
        aoKeyWords.some((keyword) => lowerCaseFile.includes(keyword))
      ) {
        textures[KEYS.AO] = file
      } else {
        const filename = file

        const fileName = path.parse(filename).name //=> "hello"
        const fileExt = path.parse(filename).ext //=> ".html"

        textures[fileName] = file
      }
    })

    // Add textures to the texture list under the subfolder name
    textureList[subfolder] = textures
  })

  return textureList
}

// Generate the texture list and write to a JSON file
try {
  const textureList = generateTextureList(rootDir)
  fs.writeFileSync(outputFile, JSON.stringify(textureList, null, 4))
  console.log(`Texture list generated successfully at ${outputFile}`)
} catch (error) {
  console.error("Error generating texture list:", error)
}
