import path from "path";
import fs from "fs";
import { v5 as uuidv5 } from "uuid";

export const UUID_NAMESPACE =
  process.env.UUID_NAMESPACE || "be203641-9392-4ae6-acd6-fe729f6a4cce";
export const UUID_NAME = process.env.UUID_NAME || "ReactCms";

export const uuid = (name, namespace) =>
  uuidv5((name || UUID_NAME) + Date(), namespace || UUID_NAMESPACE);

// helper function to parse JSON twice when needed
export const parseJSON = (data) =>
  typeof JSON.parse(data.toString()) === "string"
    ? JSON.parse(JSON.parse(data.toString()))
    : JSON.parse(data.toString());

// default error handler
export const consoleError = (err) => {
  console.log(err);
};

// path to JSON files will be available on req.body.jsonPath and will fall back to process.env.JSON_PATH and then to the default
export const defaultJsonPath = path.join(process.cwd(), "src", "json");
// helper function to get the jsonPath

export const getJsonPath = (req) => {
  return (
    (req.body && req.body.jsonPath) || process.env.JSON_PATH || defaultJsonPath
  );
};

// helper function to call fs.readFile as a promise
export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(parseJSON(data));
    });
  });
};

// helper function to call fs.writeFile as a promise
export const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path,
      typeof data === "string" ? data : JSON.stringify(data),
      (err) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
};

export default {
  consoleError,
  getJsonPath,
  readFile,
  writeFile,
};
