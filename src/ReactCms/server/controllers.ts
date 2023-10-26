// controllers to handle CRUD operations on local JSON files for models, fields, and entries

// import the path module
import * as path from "path";

// import the file system module
import * as fs from "fs";

import {
  Obj,
  consoleError,
  getJsonPath,
  readFile,
  uuid,
  writeFile,
} from "./helpers.js";
import { Request, Response } from "express";
import { Entry, Field, Model } from "../settings/types.js";

/** MODEL CONTROLLERS */

// get all the models
export const getModels = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the model json filenames from the models.json file
  const models:string[] = await readFile(`${jsonPath}/models.json`).catch(consoleError);
  if (!models) return res.status(404).send("Model Manifest Not Found");

  // get the models from the model json files
  const modelData:Model[] | void = await Promise.all(
    models.map((model) => readFile(`${jsonPath}/model_${model}.json`))
  ).catch(consoleError);

  // send the models
  res.send(modelData);
};

// get a single model
export const getModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { modelId } = req.params;
  // get the model from the model json file
  const model: Model = await readFile(`${jsonPath}/model_${modelId}.json`).catch(
    consoleError
  );
  if (!model) return res.status(404).send("Model Not Found");

  // send the model
  res.send(model);
};

// create a model
export const createModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request body
  const model: Model = req.body;
  if (!model) return res.status(400).send("Model Not Provided");
  if (!model.id) model.id = uuid(model.name);

  // get the model manifest
  const models: string[] = await readFile(`${jsonPath}/models.json`).catch(consoleError);
  if (!models) return res.status(404).send("Model Manifest Not Found");

  // write the model to the model json file
  const newFile:Model = await writeFile(
    `${jsonPath}/model_${model.id}.json`,
    model
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Model");

  const newModel:Model = await readFile(`${jsonPath}/model_${model.id}.json`).catch(
    consoleError
  );
  if (!newModel) return res.status(500).send("Error Writing Model");

  // add the model to the model manifest
  models.push(model.id);

  // write the model manifest to the model manifest json file
  writeFile(`${jsonPath}/models.json`, models)
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Error Writing Model Manifest");
    });
};

// update a model
export const updateModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request body
  const model:Model = req.body;
  if (!model) return res.status(400).send("Model Not Provided");
  if (!model.id) return res.status(400).send("Model ID Not Provided");
  if (model.id !== req.params.modelId)
    return res.status(400).send("Model ID Mismatch");

  // get the model manifest
  const models:string[] = await readFile(`${jsonPath}/models.json`).catch(consoleError);
  if (!models) return res.status(404).send("Model Manifest Not Found");

  // write the model to the model json file
  const newFile:Model = await writeFile(
    `${jsonPath}/model_${model.id}.json`,
    model
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Model");

  const newModel:Model = await readFile(`${jsonPath}/model_${model.id}.json`).catch(
    consoleError
  );
  if (!newModel) return res.status(500).send("Error Reading New Model");

  // send the model
  res.send(newModel);
};

// delete a model
export const deleteModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { modelId } = req.params;
  // get the model manifest
  const models: string[] = await readFile(`${jsonPath}/models.json`).catch(consoleError);
  if (!models) return res.status(404).send("Model Manifest Not Found");

  // remove the model from the model manifest
  const newModels: string[] = models.filter(
    (model: string) => model !== modelId
  );

  // write the model manifest to the model manifest json file
  writeFile(`${jsonPath}/models.json`, newModels)
    .then(() => {
      // delete the model json file
      fs.unlink(`${jsonPath}/model_${modelId}.json`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error Deleting Model");
        } else {
          // send the model
          return res.status(200).send(req.params.modelId);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Error Writing Model Manifest");
    });
};

/** FIELD CONTROLLERS */

// get all the fields
export const getFields = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the field json filenames from the fields.json file
  const fields:string[] = await readFile(`${jsonPath}/fields.json`).catch(consoleError);
  if (!fields) return res.status(404).send("Field Manifest Not Found");

  // get the fields from the field json files
  const fieldData: Field[] | void = await Promise.all(
    fields.map((field: string) => readFile(`${jsonPath}/field_${field}.json`))
  ).catch(consoleError);
  if (!fieldData)
    return res.status(404).send("Field(s) Data Not Found");

  // send the fields
  res.send(fieldData);
};

// get a single field
export const getField = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { fieldId } = req.params;

  // get the field from the field json file
  const field:Field = await readFile(`${jsonPath}/field_${fieldId}.json`).catch(
    consoleError
  );
  if (!field) return res.status(404).send("Field Not Found");

  // send the field
  res.send(field);
};

// get all fields by model
export const getFieldsByModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request
  const { modelId } = req.params;
  if (!modelId) return res.status(400).send("Model Not Provided");

  // get the model from the model json file
  const modelData: Model = await readFile(`${jsonPath}/model_${modelId}.json`);
  if (!modelData) return res.status(404).send("Model Not Found");
  if (!modelData.fields) return res.status(404).send("Model Has No Fields");

  // get the fields from the field json files
  const fieldData: Field[] | void = await Promise.all(
    modelData.fields.map((field: string) =>
      readFile(`${jsonPath}/field_${field}.json`)
    )
  ).catch(consoleError);
  if (!fieldData) return res.status(404).send("Field(s) Data Not Found");

  // send the fields
  res.send(fieldData);
};

// create a field
export const createField = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the field from the request body
  const field:Field = req.body;
  if (!field) return res.status(400).send("Field Not Provided");
  if (!field.model) return res.status(400).send("Field Model Not Provided");
  if (!field.id) field.id = uuid(field.model);

  // get the model file
  const model: Model = await readFile(
    `${jsonPath}/model_${field.model}.json`
  ).catch(consoleError);
  if (!model) return res.status(404).send("Model Not Found");
  if (!model.fields) model.fields = [];
  if (model.fields.includes(field.id))
    return res.status(400).send("Field ID Already Exists");

  // get the field manifest
  const fields: string[] = await readFile(`${jsonPath}/fields.json`).catch(
    consoleError
  );
  if (!fields) return res.status(404).send("Field Manifest Not Found");

  // write the field to the field json file
  const newFile: Field = await writeFile(
    `${jsonPath}/field_${field.id}.json`,
    field
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Field");

  // read the field from the field json file
  const newField: Field = await readFile(
    `${jsonPath}/field_${field.id}.json`
  ).catch(consoleError);
  if (!newField) return res.status(500).send("Error Reading New Field");

  // add the field to the field manifest
  fields.push(field.id);

  // write the field manifest to the field manifest json file
  const newManifest: string[] = await writeFile(
    `${jsonPath}/fields.json`,
    fields
  ).catch(consoleError);
  if (!newManifest) return res.status(500).send("Error Writing Field Manifest");

  // add the field to the model
  if (!model.fields) model.fields = [];
  model.fields.push(field.id);

  // write the model to the model json file
  const newModel: Model = await writeFile(
    `${jsonPath}/model_${model.id}.json`,
    model
  ).catch(consoleError);
  if (!newModel) return res.status(500).send("Error Writing Model");

  res.send(newField);
};

// update a field
export const updateField = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the field from the request body
  const field: Field = req.body;
  if (!field) return res.status(400).send("Field Not Provided");
  if (!field.id) return res.status(400).send("Field ID Not Provided");
  if (field.id !== req.params.fieldId)
    return res.status(400).send("Field ID Mismatch");

  // get the field manifest
  const fields: string[] = await readFile(`${jsonPath}/fields.json`).catch(consoleError);
  if (!fields) return res.status(404).send("Field Manifest Not Found");

  // write the field to the field json file
  const newFile: Field = await writeFile(
    `${jsonPath}/field_${field.id}.json`,
    field
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Field");

  const newField: Field = await readFile(`${jsonPath}/field_${field.id}.json`).catch(
    consoleError
  );
  if (!newField) return res.status(500).send("Error Reading New Field");

  // send the field
  res.status(201).send(newField);
};

// delete a field
export const deleteField = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { fieldId } = req.params;

  // get the field manifest
  const fields: string[] = await readFile(`${jsonPath}/fields.json`).catch(
    consoleError
  );
  if (!fields) return res.status(404).send("Field Manifest Not Found");

  // get the associated field json file
  const oldField: Field = await readFile(
    `${jsonPath}/field_${fieldId}.json`
  ).catch(consoleError);
  if (!oldField) return res.status(404).send("Field Not Found");

  // get the associated model json file
  const model: Model = await readFile(
    `${jsonPath}/model_${oldField.model}.json`
  ).catch(consoleError);
  if (!model) return res.status(404).send("Model Not Found");
  model.fields = model.fields.filter((field) => field !== fieldId);

  // remove the field from the field manifest
  const newFields: string[] = fields.filter((field) => field !== fieldId);

  // write the field manifest to the field manifest json file
  const newManifest: string[] = await writeFile(
    `${jsonPath}/fields.json`,
    newFields
  ).catch(consoleError);
  if (!newManifest) return res.status(500).send("Error Writing Field Manifest");

  const newModel: Model = await writeFile(
    `${jsonPath}/model_${model.id}.json`,
    model
  ).catch(consoleError);
  if (!newModel) return res.status(500).send("Error Writing Model");

  // delete the field json file
  fs.unlink(`${jsonPath}/field_${fieldId}.json`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error Deleting Field File");
    } else {
      // send the field
      return res.status(200).send(fieldId);
    }
  });
};

/** ENTRY CONTROLLERS */

// get all the entries
export const getEntries = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the entry json filenames from the entries.json file
  const entries: string[] = await readFile(
    path.join(jsonPath, "entries.json")
  ).catch(consoleError);
  if (!entries) return res.status(404).send("Entry Manifest Not Found");

  // get the entries from the entry json files
  const entryData: Entry[] | void = await Promise.all(
    entries.map(async (entry) => readFile(`${jsonPath}/entry_${entry}.json`))
  ).catch(consoleError);
  if (!entryData) return res.status(404).send("Entry Data Not Found");

  // send the entries
  res.send(entryData);
};

// get a single entry
export const getEntry = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { entryId } = req.params;

  // get the entry from the entry json file
  const entry: Entry = await readFile(
    `${jsonPath}/entry_${entryId}.json`
  ).catch(consoleError);
  if (!entry) return res.status(404).send("Entry Not Found");

  // send the entry
  res.send(entry);
};

// get all entries by model
export const getEntriesByModel = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request
  const { modelId } = req.params;
  if (!modelId) return res.status(400).send("Model Not Provided");

  // get the model from the model json file
  const model: Model = await readFile(
    `${jsonPath}/model_${modelId}.json`
  ).catch(consoleError);
  if (!model) return res.status(404).send("Model Not Found");

  // get the entries from the entry json files
  const entryData: Entry[] | void = await Promise.all(
    model.entries.map((entry) => readFile(`${jsonPath}/entry_${entry}.json`))
  ).catch(consoleError);
  if (!entryData) return res.status(404).send("Entry Data Not Found");

  // send the entries
  res.send(entryData);
};

// create an entry
export const createEntry = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the entry from the request body
  const entry: Entry = req.body;
  if (!entry) return res.status(400).send("Entry Not Provided");
  if (!entry.model) return res.status(400).send("Entry Model Not Provided");
  if (!entry.id) entry.id = uuid(entry.model);

  // get the entry manifest
  const entries: string[] = await readFile(`${jsonPath}/entries.json`).catch(
    consoleError
  );
  if (!entries) return res.status(404).send("Entry Manifest Not Found");

  // get the model file
  const model: Model = await readFile(
    `${jsonPath}/model_${entry.model}.json`
  ).catch(consoleError);
  if (!model) return res.status(404).send("Model Not Found");

  // write the entry to the entry json file
  const newFile: Entry = await writeFile(
    `${jsonPath}/entry_${entry.id}.json`,
    entry
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Entry");

  const newEntry: Entry = await readFile(
    `${jsonPath}/entry_${entry.id}.json`
  ).catch(consoleError);
  if (!newEntry) return res.status(500).send("Error Reading New Entry");

  // add the entry to the entry manifest
  entries.push(entry.id);

  // write the entry manifest to the entry manifest json file
  const newManifest: string[] = await writeFile(
    `${jsonPath}/entries.json`,
    entries
  ).catch(consoleError);
  if (!newManifest) return res.status(500).send("Error Writing Entry Manifest");

  // add the entry to the model
  if (!model.entries) model.entries = [];
  if (!model.entries.includes(entry.id)) {
    model.entries.push(entry.id);
    writeFile(`${jsonPath}/model_${model.id}.json`, model)
      .then(() => res.status(201).send(newEntry))
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Error Writing Model");
      });
  }
};

// update an entry
export const updateEntry = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);

  // get the entry from the request body
  const entry: Entry = req.body;
  if (!entry) return res.status(400).send("Entry Not Provided");
  if (!entry.id) return res.status(400).send("Entry ID Not Provided");
  if (entry.id !== req.params.entryId)
    return res.status(400).send("Entry ID Mismatch");

  // get the entry manifest
  const entries: string[] = await readFile(`${jsonPath}/entries.json`).catch(
    consoleError
  );
  if (!entries) return res.status(404).send("Entry Manifest Not Found");

  // write the entry to the entry json file
  const newFile: Entry = await writeFile(
    `${jsonPath}/entry_${entry.id}.json`,
    entry
  ).catch(consoleError);
  if (!newFile) return res.status(500).send("Error Writing Entry");

  const newEntry: Entry = await readFile(
    `${jsonPath}/entry_${entry.id}.json`
  ).catch(consoleError);
  if (!newEntry) return res.status(500).send("Error Reading New Entry");

  // send the entry
  res.send(newEntry);
};

// delete an entry
export const deleteEntry = async (req: Request, res: Response) => {
  const jsonPath = getJsonPath(req);
  const { entryId } = req.params;
  // get the entry manifest
  const entries:string[] = await readFile(`${jsonPath}/entries.json`).catch(
    consoleError
  );
  if (!entries) return res.status(404).send("Entry Manifest Not Found");

  // get the associated entry json file
  const oldEntry:Entry = await readFile(`${jsonPath}/entry_${entryId}.json`).catch(
    consoleError
  );
  if (!oldEntry) return res.status(404).send("Entry Not Found");

  // get the associated model json file
  const model:Model = await readFile(
    `${jsonPath}/model_${oldEntry.model}.json`
  ).catch(consoleError);
  if (!model) return res.status(404).send("Model Not Found");
  model.entries = model.entries.filter((entry) => entry !== entryId);

  const newModel:Model = await writeFile(
    `${jsonPath}/model_${model.id}.json`,
    model
  ).catch(consoleError);
  if (!newModel) return res.status(500).send("Error Writing Model");

  // remove the entry from the entry manifest
  const newEntries:string[] = entries.filter((entry) => entry !== entryId);

  // write the entry manifest to the entry manifest json file
  writeFile(`${jsonPath}/entries.json`, newEntries)
    .then(() => {
      // delete the entry json file
      fs.unlink(`${jsonPath}/entry_${entryId}.json`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error Deleting Entry");
        } else {
          // send the entry id
          return res.status(200).send(entryId);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Error Writing Entry Manifest");
    });
};

export default {
  getModels,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  getFields,
  getField,
  getFieldsByModel,
  createField,
  updateField,
  deleteField,
  getEntries,
  getEntry,
  getEntriesByModel,
  createEntry,
  updateEntry,
  deleteEntry,
};
