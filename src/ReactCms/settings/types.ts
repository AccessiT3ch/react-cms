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
  
  export interface FieldTextType extends Field {
    type: "text";
    option: "text" | "textarea";
    typeOptions: ["text", "textarea"];
    typeOptionStrings: ["Single Line", "Multi Line"];
    min: number;
    max: number;
  }
  
  export interface FieldNumberType extends Field {
    type: "number";
    min: number;
    max: number;
    step: number;
    typeOptions: ["number", "range"];
    typeOptionStrings: ["Number Input", "Range Slider"];
    option: "number" | "range";
    unit: string;
  }
  
  export interface FieldNumberRangeType extends FieldNumberType {
    name: "New Range Field",
    option: "range",
    defaultValue: [number, number],
  }
  
  export interface FieldBooleanType extends Field {
    type: "boolean";
    typeOptions: ["checkbox", "switch"],
    typeOptionStrings: ["Checkbox", "Switch"],
    trueLabel: string;
    falseLabel: string;
    defaultValue: boolean;
  }
  
  export interface FieldSelectType extends Field {
    type: "select";
    options: string;
    option: "one" | "many";
    typeOptions: ["one", "many"];
    typeOptionStrings: ["Select One", "Select Many"];
    defaultValue: string;
  }
  
  export interface FieldDateType extends Field {
    type: "date";
    option: "date" | "datetime-local" | "time";
    typeOptions: ["date", "datetime-local", "time"];
    typeOptionStrings: ["Date", "Date & Time", "Time"];
  }
  
  export type FieldTypes = FieldTextType | FieldNumberType | FieldNumberRangeType | FieldBooleanType | FieldSelectType | FieldDateType;
  
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
    labelOption?: "date" | "text" | string;
  }
  
  export interface ModelState {
    [modelId: string]: Model;
  }
  
  
  