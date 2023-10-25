// controllers to handle CRUD operations on local JSON files for models, fields, and entries

// import the path module
import * as path from 'path';

// import the file system module
import * as fs from 'fs';

// path to JSON files will be available on req.body.jsonPath and will fall back to process.env.JSON_PATH and then to the default
const defaultJsonPath = path.join(process.cwd(), 'src', 'json');

export const consoleError = (err) => {
  console.log(err);
}

// helper function to get the jsonPath
export const getJsonPath = (req) => {
  return (req.body && req.body.jsonPath) || process.env.JSON_PATH || defaultJsonPath;
}

// helper function to call fs.readFile as a promise
export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data.toString()));
    });
  });
}

// helper function to call fs.writeFile as a promise
export const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

/** MODEL CONTROLLERS */

// get all the models
export const getModels = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model json filenames from the models.json file
  const models = await readFile(`${jsonPath}/models.json`).catch((consoleError));
  if (!models) return res.status(404).send('Model Manifest Not Found');

  // get the models from the model json files
  const modelData = await Promise.all(models.map((model) => 
    readFile(`${jsonPath}/${model}.json`))).catch(consoleError);

  const modelDataById = modelData?.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  if (!modelDataById || !Object.keys(modelDataById).length) return res.status(404).send('Model Data Not Found');

  // send the models
  res.send(modelData);
};

// get a single model
export const getModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model from the model json file
  const model = await readFile(`${jsonPath}/model_${req.params.id}.json`).catch((consoleError));
  if (!model) return res.status(404).send('Model Not Found');

  // send the model
  res.send(model);
};

// create a model
export const createModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request body
  const model = req.body.entity;
  if (!model) return res.status(400).send('Model Not Provided');

  // get the model manifest
  const models = await readFile(`${jsonPath}/models.json`).catch((consoleError));
  if (!models) return res.status(404).send('Model Manifest Not Found');

  // write the model to the model json file
  const newFile = await writeFile(`${jsonPath}/model_${model.id}.json`, JSON.stringify(model)).catch((consoleError));
  if (!newFile) return res.status(500).send('Error Writing Model');

  const newModel = await readFile(`${jsonPath}/model_${model.id}.json`).catch((consoleError));
  if (!newModel) return res.status(500).send('Error Writing Model');


  // add the model to the model manifest
  models.push(model.id);

  // write the model manifest to the model manifest json file
  writeFile(`${jsonPath}/models.json`, JSON.stringify(models))
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Model Manifest');
    });
};

// update a model
export const updateModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request body
  const model = req.body.entity;
  if (!model) return res.status(400).send('Model Not Provided');
  if (!model.id) return res.status(400).send('Model ID Not Provided');
  if (model.id !== req.params.id) return res.status(400).send('Model ID Mismatch');

  // get the model manifest
  const models = await readFile(`${jsonPath}/models.json`).catch((consoleError));
  if (!models) return res.status(404).send('Model Manifest Not Found');

  // write the model to the model json file
  const newFile = await writeFile(`${jsonPath}/model_${model.id}.json`, JSON.stringify(model)).catch(consoleError);
  if (!newFile) return res.status(500).send('Error Writing Model');

  const newModel = await readFile(`${jsonPath}/model_${model.id}.json`).catch((consoleError));
  if (!newModel) return res.status(500).send('Error Reading New Model');

  // send the model
  res.send(newModel);
};

// delete a model
export const deleteModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model manifest
  const models = await readFile(`${jsonPath}/models.json`).catch((consoleError));
  if (!models) return res.status(404).send('Model Manifest Not Found');

  // remove the model from the model manifest
  const newModels = models.filter((model) => model !== req.params.id);

  // write the model manifest to the model manifest json file
  writeFile(`${jsonPath}/models.json`, JSON.stringify(newModels))
    .then(() => {
      // delete the model json file
      fs.unlink(`${jsonPath}/${req.params.id}.json`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error Deleting Model');
        } else {
          // send the model
          return res.status(200).send(req.params.id);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Model Manifest'); 
    });
};

/** FIELD CONTROLLERS */

// get all the fields
export const getFields = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the field json filenames from the fields.json file
  const fields = await readFile(`${jsonPath}/fields.json`).catch((consoleError));
  if (!fields) return res.status(404).send('Field Manifest Not Found');

  // get the fields from the field json files
  const fieldData = await Promise.all(fields.map((field) => 
    readFile(`${jsonPath}/field_${field}.json`))).catch(consoleError);

  const fieldDataById = fieldData?.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  if (!fieldDataById || !Object.keys(fieldDataById).length) return res.status(404).send('Field Data Not Found');

  // send the fields
  res.send(fieldData);
};

// get a single field
export const getField = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the field from the field json file
  const field = await readFile(`${jsonPath}/field_${req.params.id}.json`).catch((consoleError));
  if (!field) return res.status(404).send('Field Not Found');

  // send the field
  res.send(field);
};

// get all fields by model
export const getFieldsByModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request
  const model = req.params.model;
  if (!model) return res.status(400).send('Model Not Provided');

  // get the model from the model json file
  const modelData = await readFile(`${jsonPath}/model_${model}.json`)
  if (!modelData) return res.status(404).send('Model Not Found');

  // get the fields from the field json files
  const fieldData = await Promise.all(modelData.fields.map((field) => 
    readFile(`${jsonPath}/field_${field}.json`))).catch(consoleError);

  const fieldDataById = fieldData?.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  });
  if (!fieldDataById || !Object.keys(fieldDataById).length) return res.status(404).send('Field Data Not Found');

  // send the fields
  res.send(fieldData);
};

// create a field
export const createField = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the field from the request body
  const field = req.body.entity;
  if (!field) return res.status(400).send('Field Not Provided');

  // get the field manifest
  const fields = await readFile(`${jsonPath}/fields.json`).catch((consoleError));
  if (!fields) return res.status(404).send('Field Manifest Not Found');

  // write the field to the field json file
  const newFile = await writeFile(`${jsonPath}/field_${field.id}.json`, JSON.stringify(field)).catch(consoleError);
  if (!newFile) return res.status(500).send('Error Writing Field');

  const newField = await readFile(`${jsonPath}/field_${field.id}.json`).catch((consoleError));
  if (!newField) return res.status(500).send('Error Reading New Field');

  // add the field to the field manifest
  fields.push(field.id);

  // write the field manifest to the field manifest json file
  writeFile(`${jsonPath}/fields.json`, JSON.stringify(fields))
    .then((data) =>  res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Field Manifest');
    });
};

// update a field
export const updateField = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the field from the request body
  const field = req.body.entity;
  if (!field) return res.status(400).send('Field Not Provided');
  if (!field.id) return res.status(400).send('Field ID Not Provided');
  if (field.id !== req.params.id) return res.status(400).send('Field ID Mismatch');

  // get the field manifest
  const fields = await readFile(`${jsonPath}/fields.json`).catch((consoleError));
  if (!fields) return res.status(404).send('Field Manifest Not Found');

  // write the field to the field json file
  const newFile = await writeFile(`${jsonPath}/field_${field.id}.json`, JSON.stringify(field)).catch(consoleError);
  if (!newFile) return res.status(500).send('Error Writing Field');

  const newField = await readFile(`${jsonPath}/field_${field.id}.json`).catch((consoleError));
  if (!newField) return res.status(500).send('Error Reading New Field');

  // send the field
  res.status(201).send(newField);
};

// delete a field
export const deleteField = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the field manifest
  const fields = await readFile(`${jsonPath}/fields.json`).catch((consoleError));
  if (!fields) return res.status(404).send('Field Manifest Not Found');

  // remove the field from the field manifest
  const newFields = fields.filter((field) => field !== req.params.id);

  // write the field manifest to the field manifest json file
  writeFile(`${jsonPath}/fields.json`, JSON.stringify(newFields))
    .then(() => {
      // delete the field json file
      fs.unlink(`${jsonPath}/field_${req.params.id}.json`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error Deleting Field');
        } else {
          // send the field
          return res.status(200).send(req.params.id);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Field Manifest');
    });
};

/** ENTRY CONTROLLERS */

// get all the entries
export const getEntries = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the entry json filenames from the entries.json file
  const entries = await readFile(path.join(jsonPath, 'entries.json')).catch((consoleError));
  if (!entries) return res.status(404).send('Entry Manifest Not Found');

  // get the entries from the entry json files
  const entryData = await Promise.all(entries.map(async (entry) =>
    readFile(`${jsonPath}/entry_${entry}.json`))).catch(consoleError);

  const entryDataById = entryData?.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  if (!entryDataById || !Object.keys(entryDataById).length) return res.status(404).send('Entry Data Not Found');

  // send the entries
  res.send(entryData);
};

// get a single entry
export const getEntry = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the entry from the entry json file
  const entry = await readFile(`${jsonPath}/entry_${req.params.id}.json`).catch((consoleError));

  // send the entry
  res.send(entry);
};

// get all entries by model
export const getEntriesByModel = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the model from the request
  const model = req.params.model;
  if (!model) return res.status(400).send('Model Not Provided');

  // get the model from the model json file
  const modelData = await readFile(`${jsonPath}/${model}.json`).catch((consoleError));
  if (!modelData) return res.status(404).send('Model Not Found');

  // get the entries from the entry json files
  const entryData = await Promise.all(modelData.entries.map((entry) => 
    readFile(`${jsonPath}/entry_${entry}.json`))).catch(consoleError);

  const entryDataById = entryData?.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
  if (!entryDataById || !Object.keys(entryDataById).length) return res.status(404).send('Entry Data Not Found');

  // send the entries
  res.send(entryData);
};

// create an entry
export const createEntry = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the entry from the request body
  const entry = req.body.entity;
  if (!entry) return res.status(400).send('Entry Not Provided');

  // get the entry manifest
  const entries = await readFile(`${jsonPath}/entries.json`).catch((consoleError));
  if (!entries) return res.status(404).send('Entry Manifest Not Found');

  // write the entry to the entry json file
  const newFile = await writeFile(`${jsonPath}/entry_${entry.id}.json`, JSON.stringify(entry)).catch(consoleError);
  if (!newFile) return res.status(500).send('Error Writing Entry');

  const newEntry = await readFile(`${jsonPath}/entry_${entry.id}.json`).catch((consoleError));
  if (!newEntry) return res.status(500).send('Error Reading New Entry');

  // add the entry to the entry manifest
  entries.push(entry.id);

  // write the entry manifest to the entry manifest json file
  writeFile(`${jsonPath}/entries.json`, JSON.stringify(entries))
    .then(() => res.status(201).send(newEntry))
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Entry Manifest');
  });
};

// update an entry
export const updateEntry = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the entry from the request body
  const entry = req.body.entity;
  if (!entry) return res.status(400).send('Entry Not Provided');
  if (!entry.id) return res.status(400).send('Entry ID Not Provided');
  if (entry.id !== req.params.id) return res.status(400).send('Entry ID Mismatch');

  // get the entry manifest
  const entries = await readFile(`${jsonPath}/entries.json`).catch((consoleError));
  if (!entries) return res.status(404).send('Entry Manifest Not Found');

  // write the entry to the entry json file
  const newFile = await writeFile(`${jsonPath}/entry_${entry.id}.json`, JSON.stringify(entry).catch(consoleError));
  if (!newFile) return res.status(500).send('Error Writing Entry');

  const newEntry = await readFile(`${jsonPath}/entry_${entry.id}.json`).catch((consoleError));
  if (!newEntry) return res.status(500).send('Error Reading New Entry');

  // send the entry
  res.send(newEntry);
}

// delete an entry
export const deleteEntry = async (req, res) => {
  const jsonPath = getJsonPath(req);

  // get the entry manifest
  const entries = await readFile(`${jsonPath}/entries.json`).catch((consoleError));
  if (!entries) return res.status(404).send('Entry Manifest Not Found');

  // remove the entry from the entry manifest
  const newEntries = entries.filter((entry) => entry !== req.params.id);

  // write the entry manifest to the entry manifest json file
  writeFile(`${jsonPath}/entries.json`, JSON.stringify(newEntries)
    .then(() => {
      // delete the entry json file
      fs.unlink(`${jsonPath}/entry_${req.params.id}.json`, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error Deleting Entry');
        } else {
          // send the entry id
          return res.status(200).send(req.params.id);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send('Error Writing Entry Manifest');
    }));
}

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
