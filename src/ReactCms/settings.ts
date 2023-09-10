/** ********** Type Definitions ********** */

// Global Definitions
export interface CrudState {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Field Definitions
export type ValueTypes =
  | string
  | number
  | boolean
  | [number, number]
  | string[]
  | undefined;

export interface Field extends CrudState {
  type: string;
  required: boolean;
  option?: string;
  typeOptions?: string[];
  typeOptionStrings?: string[];
  defaultValue: ValueTypes;
}

export interface FieldText extends Field {
  type: "text";
  option: "text" | "textarea";
  typeOptions: ["text", "textarea"];
  typeOptionStrings: ["Single Line", "Multi Line"];
  min: number;
  max: number;
}

export interface FieldNumber extends Field {
  type: "number";
  min: number;
  max: number;
  step: number;
  typeOptions: ["number", "range"];
  typeOptionStrings: ["Number Input", "Range Slider"];
  option: "number" | "range";
  unit: string;
}

export interface FieldNumberRange extends FieldNumber {
  name: "New Range Field",
  option: "range",
  defaultValue: [number, number],
}

export interface FieldBoolean extends Field {
  type: "boolean";
  typeOptions: ["checkbox", "switch"],
  typeOptionStrings: ["Checkbox", "Switch"],
  trueLabel: string;
  falseLabel: string;
  defaultValue: boolean;
}

export interface FieldSelect extends Field {
  type: "select";
  options: string;
  option: "one" | "many";
  typeOptions: ["one", "many"];
  typeOptionStrings: ["Select One", "Select Many"];
  defaultValue: string;
}

export interface FieldDate extends Field {
  type: "date";
  option: "date" | "datetime-local" | "time";
  typeOptions: ["date", "datetime-local", "time"];
  typeOptionStrings: ["Date", "Date & Time", "Time"];
}

export type FieldTypes = FieldText | FieldNumber | FieldNumberRange | FieldBoolean | FieldSelect | FieldDate;

export interface FieldState {
  [fieldId: string]: FieldTypes;
}

// Entry Definitions
export interface EntryValues {
  label: string;
  [fieldId: string]: ValueTypes;
}
export interface Entry extends CrudState {
  values: EntryValues;
}
export interface EntryState {
  [entryId: string]: Entry;
}

// Model Definitions
export interface Model extends CrudState {
  fields: FieldState;
  entries: EntryState;
  deletedFields: string[];
  deletedEntries: string[];
  sort?: string;
  order?: "asc" | "desc";
}

export interface ModelState {
  [modelId: string]: Model;
}


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
  ...initialCRUDState,
};

export const initialFieldTextState: FieldText = {
  ...initialFieldState,
  type: "text",
  option: "text",
  typeOptions: ["text", "textarea"],
  typeOptionStrings: ["Single Line", "Multi Line"],
  min: 0,
  max: 0,
};

export const initialFieldNumberState: FieldNumber = {
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

export const initialFieldNumberRangeState: FieldNumberRange = {
  ...initialFieldNumberState,
  name: "New Range Field",
  option: "range",
  defaultValue: [0, 100],
};

export const initialFieldBooleanState: FieldBoolean = {
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

export const initialFieldSelectState: FieldSelect = {
  ...initialFieldState,
  name: "New Select Field",
  type: "select",
  option: "one",
  typeOptions: ["one", "many"],
  typeOptionStrings: ["Select One", "Select Many"],
  defaultValue: "",
  options: "",
};

export const initialFieldDateState: FieldDate = {
  ...initialFieldState,
  name: "New Date Field",
  type: "date",
  typeOptions: ["date", "datetime-local", "time"],
  typeOptionStrings: ["Date", "Date & Time", "Time"],
  option: "date",
  defaultValue: new Date().toLocaleString(),
};


/** ********** Helper Function ********** */

export const getNewFieldState = (type: string = "text"): Field => {
  let newFieldState = {} as Field;
  switch (type) {
    case "number":
      newFieldState = { ...initialFieldNumberState } as FieldNumber;
      break;
    case "boolean":
      newFieldState = { ...initialFieldBooleanState } as FieldBoolean;
      break;
    case "select":
      newFieldState = { ...initialFieldSelectState } as FieldSelect;
      break;
    case "date":
      newFieldState = { ...initialFieldDateState } as FieldDate;
      break;
    case "text":
    default:
      newFieldState = { ...initialFieldTextState } as FieldText;
      break;
  }
  return newFieldState;
};
