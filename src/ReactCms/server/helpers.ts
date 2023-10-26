import path from "path";
import fs from "fs";
import { v5 as uuidv5 } from "uuid";
import { Request } from "express";

export const UUID_NAMESPACE =
  process.env.UUID_NAMESPACE || "be203641-9392-4ae6-acd6-fe729f6a4cce";
export const UUID_NAME = process.env.UUID_NAME || "ReactCms";

export const uuid = (
  name: string = UUID_NAME,
  namespace: string = UUID_NAMESPACE
) => uuidv5(name + Date(), namespace);

export interface Obj {
  [key: string]: any;
}
// helper function to parse JSON twice when needed
export const parseJSON = (data: string | Obj): Obj | any[] =>
  typeof JSON.parse(data.toString()) === "string"
    ? JSON.parse(JSON.parse(data.toString()))
    : JSON.parse(data.toString());

// default error handler
export const consoleError = (err: any) => {
  console.log(err);
};

// path to JSON files will be available on req.body.jsonPath and will fall back to process.env.JSON_PATH and then to the default
export const defaultJsonPath: string = path.join(process.cwd(), "src", "json");
// helper function to get the jsonPath

export const getJsonPath = (req: Request | void): string => {
  return (
    (req?.body?.jsonPath) || process.env.JSON_PATH || defaultJsonPath
  );
};

// helper function to call fs.readFile as a promise
export const readFile = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(parseJSON(data));
    });
  });
};

// helper function to call fs.writeFile as a promise
export const writeFile = (
  path: string,
  data: any | string
): Promise<any> => {
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
