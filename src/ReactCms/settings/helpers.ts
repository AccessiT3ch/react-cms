import {
  CrudState,
  Field,
  FieldTextType,
  FieldNumberType,
  FieldNumberRangeType,
  FieldBooleanType,
  FieldSelectType,
  FieldDateType,
  Model,
} from "./types";

import {
  MODEL_URL,
  EDIT_MODEL_URL,
  EDIT_MODEL_FIELD_URL,
  ADD_MODEL_FIELD_URL,
  ADD_MODEL_ENTRY_URL,
  EDIT_MODEL_ENTRY_URL,
  MODEL_ID_URL_PARAM,
  ENTRY_ID_URL_PARAM,
  FIELD_URL_PARAM,
} from "./strings";

/** ********** Initial States ********** */

export const initialCRUDState: CrudState = {
  id: "",
  name: "",
  slug: "",
  createdAt: "",
  updatedAt: "",
};

export const initialFieldState: Field = {
  type: "",
  required: false,
  defaultValue: undefined,
  model: "",
  ...initialCRUDState,
};

export const initialFieldTextState: FieldTextType = {
  ...initialFieldState,
  type: "text",
  option: "text",
  typeOptions: ["text", "textarea"],
  typeOptionStrings: ["Single Line", "Multi Line"],
  min: 0,
  max: 0,
};

export const initialFieldNumberState: FieldNumberType = {
  ...initialFieldState,
  name: "New Number Field",
  type: "number",
  option: "number",
  typeOptions: ["number", "range"],
  typeOptionStrings: ["Number Input", "Range Slider"],
  defaultValue: 0,
  min: 0,
  step: 1,
  max: 100,
  unit: "",
};

export const initialFieldNumberRangeState: FieldNumberRangeType = {
  ...initialFieldNumberState,
  name: "New Range Field",
  option: "range",
  defaultValue: [0, 100],
};

export const initialFieldBooleanState: FieldBooleanType = {
  ...initialFieldState,
  name: "New Boolean Field",
  type: "boolean",
  option: "checkbox",
  typeOptions: ["checkbox", "switch"],
  typeOptionStrings: ["Checkbox", "Switch"],
  defaultValue: false,
  trueLabel: "True",
  falseLabel: "False",
};

export const initialFieldSelectState: FieldSelectType = {
  ...initialFieldState,
  name: "New Select Field",
  type: "select",
  option: "one",
  typeOptions: ["one", "many"],
  typeOptionStrings: ["Select One", "Select Many"],
  defaultValue: "",
  options: "",
};

export const initialFieldDateState: FieldDateType = {
  ...initialFieldState,
  name: "New Date Field",
  type: "date",
  typeOptions: ["date", "datetime-local", "time"],
  typeOptionStrings: ["Date", "Date & Time", "Time"],
  option: "date",
  defaultValue: new Date().toLocaleString(),
};

export const initialModelState: Model = {
  ...initialCRUDState,
  fields: {},
  entries: {},
  deletedFields: [],
  deletedEntries: [],
  sort: "",
  order: "asc",
};
/** ********** Helper Function ********** */

export const getNewFieldState = (type: string = "text"): Field => {
  let newFieldState = {} as Field;
  switch (type) {
    case "number":
      newFieldState = { ...initialFieldNumberState } as FieldNumberType;
      break;
    case "boolean":
      newFieldState = { ...initialFieldBooleanState } as FieldBooleanType;
      break;
    case "select":
      newFieldState = { ...initialFieldSelectState } as FieldSelectType;
      break;
    case "date":
      newFieldState = { ...initialFieldDateState } as FieldDateType;
      break;
    case "text":
    default:
      newFieldState = { ...initialFieldTextState } as FieldTextType;
      break;
  }
  return newFieldState;
};

export const getHomeURL = (basename: string = ""): string => basename + "/";

export const getModelUrl = (id: string, basename:string = "") => basename + MODEL_URL + id;

export const getEditModelURL = (id: string, basename: string = ""): string =>
  basename + EDIT_MODEL_URL.replace(MODEL_ID_URL_PARAM, id);

export const getEditFieldURL = (id: string, field: string, basename = ""): string =>
  basename + EDIT_MODEL_FIELD_URL.replace(MODEL_ID_URL_PARAM, id).replace(FIELD_URL_PARAM, field);

export const getAddFieldURL = (id: string, basename = ""): string =>
  basename + ADD_MODEL_FIELD_URL.replace(MODEL_ID_URL_PARAM, id);

export const getAddEntryURL = (id: string, basename = ""): string =>
  basename + ADD_MODEL_ENTRY_URL.replace(MODEL_ID_URL_PARAM, id);

export const getEditEntryURL = (id: string, entry: string, basename = ""): string =>
  basename + EDIT_MODEL_ENTRY_URL.replace(MODEL_ID_URL_PARAM, id).replace(
    ENTRY_ID_URL_PARAM,
    entry
  );