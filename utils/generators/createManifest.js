const createUUID = require("../generators/createUUID");
const createISBN = require("../generators/createISBN");
const listAudio = require("../listmakers/listAudio");
const makeFileObject = require("../transformers/fileObject");
const messager = require("../../data/messages");
const pk = require("../../data/private-keys.json");

module.exports = (basePath, answers) => {
  try {
    const idTypes = {
      address: messager().prompts.idTypes.address,
      isbn: messager().prompts.idTypes.isbn,
      uuid: messager().prompts.idTypes.uuid
    }

    let manifest = {
      "@context": ["https://schema.org", "https://www.w3.org/ns/pub-context"],
      "conformsTo": "https://www.w3/org/TR/audiobooks/",
      "type": "Audiobook",
      "dateModified": new Date()
    };

    if (answers[pk.createToc]) {
      answers[pk.tocFile] = basePath + "/index.html";
    }

    if (answers[pk.address]) {
      if (answers[pk.idType] === idTypes.address) {
        manifest.id = answers[pk.address];
      } else {
        manifest.url = answers[pk.address];
      }
    }

    if ((answers[pk.idType] === idTypes.isbn) && answers[pk.isbn]) {
      manifest.id = createISBN(answers[pk.isbn]);
    }

    if ((answers[pk.idType] === idTypes.uuid) || (!answers[pk.address] && !answers[pk.isbn])) {
      manifest.id = createUUID();
    }

    for (const prop in answers) {
      if (!Object.values(pk).includes(prop)) {
        const value = answers[prop];
        if (value) {
          if (prop === "datePublished") {
            manifest[prop] = value.toISOString().split("T")[0];
          } else {
            manifest[prop] = value;
          }
        }
      }
    };

    if (answers[pk.coverFile] || answers[pk.tocFile]) {
      manifest.resources = [];
    }

    if (answers[pk.coverFile]) {
      const coverObject = makeFileObject("image", answers[pk.coverFile], basePath, "Cover", "cover");
      manifest.resources.push(coverObject);
    };

    if (answers[pk.tocFile]) {
      const tocObject = makeFileObject("document", answers[pk.tocFile], basePath, "Contents", "contents");
      manifest.resources.push(tocObject);
    }

    manifest.readingOrder = listAudio(basePath);

    return manifest;
  } catch (err) {
    throw err;
  }
}