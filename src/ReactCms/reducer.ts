import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Entry, EntryState, EntryValues, FieldState, FieldTypes, Model, ModelState, ValueTypes } from "./settings";
import { useSelector } from "react-redux";

// Name and Initial State
export const modelSliceName = "models";
export const initialModelState = {} as ModelState;

// Action Types
export const ADD_MODEL_ACTION = "model/add";
export const REMOVE_MODEL_ACTION = "model/remove";
export const UPDATE_MODEL_ACTION = "model/update";
export const ADD_ENTRY_ACTION = "entry/add";
export const REMOVE_ENTRY_ACTION = "entry/remove";
export const UPDATE_ENTRY_ACTION = "entry/update";
export const ADD_FIELD_ACTION = "field/add";
export const REMOVE_FIELD_ACTION = "field/remove";
export const UPDATE_FIELD_ACTION = "field/update";

// Slice
export const modelSlice: Slice<any, SliceCaseReducers<any>, string> = createSlice(
  {
    name: modelSliceName,
    initialState: initialModelState,
    reducers: {
      [ADD_MODEL_ACTION]: (state, action) => {
        const { model } = action.payload;
        state[model.id] = model;
        state[model.id].createdAt = new Date().toISOString();
        state[model.id].updatedAt = state[model.id].createdAt;
      },
      [REMOVE_MODEL_ACTION]: (state, action) => {
        const { modelId } = action.payload;
        delete state[modelId];
      },
      [UPDATE_MODEL_ACTION]: (state, action) => {
        const { modelId, model } = action.payload;
        state[modelId] = {
          ...state[modelId],
          ...model,
          updatedAt: new Date().toISOString(),
        };
      },
      [ADD_ENTRY_ACTION]: (state, action) => {
        const { modelId, entry } = action.payload;
        state[modelId].entries[entry.id] = { ...entry };
        state[modelId].entries[entry.id].createdAt = new Date().toISOString();
        state[modelId].entries[entry.id].updatedAt = state[modelId].entries[entry.id].createdAt;
      },
      [REMOVE_ENTRY_ACTION]: (state, action) => {
        const { modelId, entryId } = action.payload;
        delete state[modelId].entries[entryId];
        if (!state[modelId].deletedEntries) {
          state[modelId].deletedEntries = [];
        }
        state[modelId].deletedEntries.push(entryId);
      },
      [UPDATE_ENTRY_ACTION]: (state, action) => {
        const { modelId, entryId, entry } = action.payload;
        state[modelId].entries[entryId] = {
          ...state[modelId].entries[entryId],
          ...entry,
          updatedAt: new Date().toISOString(),
        };
      },
      [ADD_FIELD_ACTION]: (state, action) => {
        const { modelId, field } = action.payload;
        state[modelId].fields[field.id] = field;
        state[modelId].fields[field.id].createdAt = new Date().toISOString();
        state[modelId].fields[field.id].updatedAt = state[modelId].fields[field.id].createdAt;
      },
      [REMOVE_FIELD_ACTION]: (state, action) => {
        const { modelId, fieldId } = action.payload;
        delete state[modelId].fields[fieldId];
        if (!state[modelId].deletedFields) {
          state[modelId].deletedFields = [];
        }
        state[modelId].deletedFields.push(fieldId);
      },
      [UPDATE_FIELD_ACTION]: (state, action) => {
        const { modelId, fieldId, field } = action.payload;
        state[modelId].fields[fieldId] = {
          ...field,
          updatedAt: new Date().toISOString(),
        };
      },
    },
  }
);

// Action Creators
export const addModel = modelSlice.actions[ADD_MODEL_ACTION];
export const removeModel = modelSlice.actions[REMOVE_MODEL_ACTION];
export const updateModel = modelSlice.actions[UPDATE_MODEL_ACTION];
export const addEntry = modelSlice.actions[ADD_ENTRY_ACTION];
export const removeEntry = modelSlice.actions[REMOVE_ENTRY_ACTION];
export const updateEntry = modelSlice.actions[UPDATE_ENTRY_ACTION];
export const addField = modelSlice.actions[ADD_FIELD_ACTION];
export const removeField = modelSlice.actions[REMOVE_FIELD_ACTION];
export const updateField = modelSlice.actions[UPDATE_FIELD_ACTION];

// Hooks
export const useModels = (): ModelState | undefined => {
  return useSelector((state: any) => state[modelSliceName]);
};
export const useModelsArray = (): Model[] | undefined => {
  const logs = useModels();
  return logs && (Object.values(logs) as Model[]);
};
export const useModel = (modelId: string): Model | undefined => {
  const logs = useModels();
  return logs && logs[modelId];
};
export const useEntries = (modelId: string): EntryState | undefined => {
  const log = useModel(modelId);
  return log && log.entries;
};
export const useEntriesArray = (modelId: string): Entry[] | undefined => {
  const entries = useEntries(modelId);
  return entries && Object.values(entries);
};
export const useEntry = (modelId: string, entryId: string): Entry | undefined => {
  const entries = useEntries(modelId);
  return entries && entries[entryId];
};
export const useEntryValue = (modelId: string, entryId: string, fieldId: string): ValueTypes | undefined => {
  const entry = useEntry(modelId, entryId);
  return entry && entry.values[fieldId];
};
export const useFields = (modelId: string): FieldState | undefined => {
  const log = useModel(modelId);
  return log && log.fields;
};
export const useFieldsArray = (modelId: string): FieldTypes[] | undefined => {
  const fields = useFields(modelId);
  return fields && Object.values(fields);
};
export const useField = (modelId: string, fieldId: string): FieldTypes | undefined => {
  const fields = useFields(modelId);
  return fields && fields[fieldId];
};

// Selectors
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
