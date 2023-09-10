import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Entry, EntryState, FieldState, FieldTypes, Model, ModelState } from "./settings";

export const modelSliceName = "models";
export const initialModelState = {} as ModelState;

// Define the action name strings
export const ADD_MODEL_ACTION = "model/add";
export const REMOVE_MODEL_ACTION = "model/remove";
export const UPDATE_MODEL_ACTION = "model/update";
export const ADD_ENTRY_ACTION = "entry/add";
export const REMOVE_ENTRY_ACTION = "entry/remove";
export const UPDATE_ENTRY_ACTION = "entry/update";
export const ADD_FIELD_ACTION = "field/add";
export const REMOVE_FIELD_ACTION = "field/remove";
export const UPDATE_FIELD_ACTION = "field/update";

// Define the slice
export const modelSlice: Slice<any, SliceCaseReducers<any>, string> = createSlice(
  {
    name: modelSliceName,
    initialState: initialModelState,
    reducers: {
      [ADD_MODEL_ACTION]: (state, action) => {
        const { log } = action.payload;
        state[log.id] = log;
        state[log.id].createdAt = new Date().toISOString();
        state[log.id].updatedAt = state[log.id].createdAt;
      },
      [REMOVE_MODEL_ACTION]: (state, action) => {
        const { logId } = action.payload;
        delete state[logId];
      },
      [UPDATE_MODEL_ACTION]: (state, action) => {
        const { logId, log } = action.payload;
        state[logId] = {
          ...state[logId],
          ...log,
          updatedAt: new Date().toISOString(),
        };
      },
      [ADD_ENTRY_ACTION]: (state, action) => {
        const { logId, entry } = action.payload;
        state[logId].entries[entry.id] = { ...entry };
        state[logId].entries[entry.id].createdAt = new Date().toISOString();
        state[logId].entries[entry.id].updatedAt = state[logId].entries[entry.id].createdAt;
      },
      [REMOVE_ENTRY_ACTION]: (state, action) => {
        const { logId, entryId } = action.payload;
        delete state[logId].entries[entryId];
        if (!state[logId].deletedEntries) {
          state[logId].deletedEntries = [];
        }
        state[logId].deletedEntries.push(entryId);
      },
      [UPDATE_ENTRY_ACTION]: (state, action) => {
        const { logId, entryId, entry } = action.payload;
        state[logId].entries[entryId] = {
          ...state[logId].entries[entryId],
          ...entry,
          updatedAt: new Date().toISOString(),
        };
      },
      [ADD_FIELD_ACTION]: (state, action) => {
        const { logId, field } = action.payload;
        state[logId].fields[field.id] = field;
        state[logId].fields[field.id].createdAt = new Date().toISOString();
        state[logId].fields[field.id].updatedAt = state[logId].fields[field.id].createdAt;
      },
      [REMOVE_FIELD_ACTION]: (state, action) => {
        const { logId, fieldId } = action.payload;
        delete state[logId].fields[fieldId];
        if (!state[logId].deletedFields) {
          state[logId].deletedFields = [];
        }
        state[logId].deletedFields.push(fieldId);
      },
      [UPDATE_FIELD_ACTION]: (state, action) => {
        const { logId, fieldId, field } = action.payload;
        state[logId].fields[fieldId] = {
          ...field,
          updatedAt: new Date().toISOString(),
        };
      },
    },
  }
);

// Extract the action creators object and the reducer
export const addModel = modelSlice.actions[ADD_MODEL_ACTION];
export const removeModel = modelSlice.actions[REMOVE_MODEL_ACTION];
export const updateModel = modelSlice.actions[UPDATE_MODEL_ACTION];
export const addLogEntry = modelSlice.actions[ADD_ENTRY_ACTION];
export const removeLogEntry = modelSlice.actions[REMOVE_ENTRY_ACTION];
export const updateLogEntry = modelSlice.actions[UPDATE_ENTRY_ACTION];
export const addLogField = modelSlice.actions[ADD_FIELD_ACTION];
export const removeLogField = modelSlice.actions[REMOVE_FIELD_ACTION];
export const updateLogField = modelSlice.actions[UPDATE_FIELD_ACTION];

export const getModels = (state: any):ModelState => state[modelSliceName] || {};

export const getModelsArray = (state: any):Model[] => {
  const logs = getModels(state);
  return Object.values(logs);
}

export const getModel = (state: any, modelId: string):Model => state[modelSliceName][modelId];

export const getEntries = (state: any, modelId: string): EntryState => {
  const log = getModel(state, modelId);
  return log?.entries;
}

export const getEntriesArray = (state: any, modelId: string):Entry[] => {
  const entries = getEntries(state, modelId);
  return Object.values(entries);
}

export const getEntry = (state: any, modelId: string, entryId: string):Entry => {
  const entries = getEntries(state, modelId);
  return entries?.[entryId];
}

export const getFields = (state: any, modelId: string):FieldState => {
  const log = getModel(state, modelId);
  return log?.fields;
}

export const getLogFieldsArray = (state: any, modelId: string):FieldTypes[] => {
  const fields = getFields(state, modelId);
  return Object.values(fields);
}

export const getLogField = (state: any, modelId: string, fieldId: string):FieldTypes => {
  const fields = getFields(state, modelId);
  return fields?.[fieldId];
}
