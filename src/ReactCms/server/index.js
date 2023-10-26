// a lightweight express app for CRUD operations on local JSON files

// import express
import express from "express";

// import the file system module
import * as fs from "fs";

// import the path module
import * as path from "path";

import controllers from "./controllers.js";
import { parseJSON } from "./helpers.js";

// create the express app
const app = express();

// use the express json parser
app.use(express.json());

// enable CORS
app.use((req, res, next) => {
  // set the headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type"
  );
  // call next
  next();
});

const jsonPath =
  process.env.JSON_PATH || path.join(process.cwd(), "src", "json");
console.log("jsonPath", jsonPath);

// check for jsonPath/models.json and create it if it doesn't exist
fs.readFile(path.join(jsonPath, "models.json"), (err, data) => {
  if (err) {
    fs.writeFile(
      path.join(jsonPath, "models.json"),
      JSON.stringify([]),
      (writeError) => {
        if (writeError) {
          console.log("Error creating models.json", writeError);
        } else {
          console.log("models.json created");
        }
      }
    );
  } else {
    console.log(`models.json exists with ${parseJSON(data).length} models`);
  }
});

// check for jsonPath/fields.json and create it if it doesn't exist
fs.readFile(path.join(jsonPath, "fields.json"), (err, data) => {
  if (err) {
    fs.writeFile(
      path.join(jsonPath, "fields.json"),
      JSON.stringify([]),
      (writeError) => {
        if (writeError) {
          console.log("Error creating fields.json", writeError);
        } else {
          console.log("fields.json created");
        }
      }
    );
  } else {
    console.log(`fields.json exists with ${parseJSON(data).length} fields`);
  }
});

// check for jsonPath/entries.json and create it if it doesn't exist
fs.readFile(path.join(jsonPath, "entries.json"), (err, data) => {
  if (err) {
    fs.writeFile(
      path.join(jsonPath, "entries.json"),
      JSON.stringify([]),
      (writeError) => {
        if (writeError) {
          console.log("Error creating entries.json", writeError);
        } else {
          console.log("entries.json created");
        }
      }
    );
  } else {
    console.log(`entries.json exists with ${parseJSON(data).length} entries`);
  }
});

// define the routes all controllers in ./controllers.ts

// CRUD routes for models
app.get("/api/models", controllers.getModels);
app.get("/api/models/:modelId", controllers.getModel);
app.post("/api/models", controllers.createModel);
app.put("/api/models/:modelId", controllers.updateModel);
app.delete("/api/models/:modelId", controllers.deleteModel);

// CRUD routes for fields
app.get("/api/fields", controllers.getFields);
app.get("/api/fields/model/:modelId", controllers.getFieldsByModel);
app.get("/api/fields/:fieldId", controllers.getField);
app.post("/api/fields", controllers.createField);
app.put("/api/fields/:fieldId", controllers.updateField);
app.delete("/api/fields/:fieldId", controllers.deleteField);

// CRUD routes for entries
app.get("/api/entries", controllers.getEntries);
app.get("/api/entries/model/:modelId", controllers.getEntriesByModel);
app.get("/api/entries/:entryId", controllers.getEntry);
app.post("/api/entries", controllers.createEntry);
app.put("/api/entries/:entryId", controllers.updateEntry);
app.delete("/api/entries/:entryId", controllers.deleteEntry);

export default app;

// run the server

// get the port from the environment variables
const port = process.env.PORT || 8888;

// listen on the port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
