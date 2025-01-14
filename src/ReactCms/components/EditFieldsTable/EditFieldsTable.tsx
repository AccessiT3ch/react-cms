import React, { FC, ReactElement } from "react";
import { Dropdown } from "react-bootstrap"
import { getNewFieldState, Field } from "../../settings";
import {
  ACTIONS,
  DELETE,
  EDIT_LABEL,
  MIDDLE,
  NAME_LABEL,
  REQUIRED_LABEL,
  SECONDARY,
  SM,
  TEXT_DANGER,
  TYPE_LABEL,
  TYPE_OPTION_LABEL,
} from "../../settings/strings";
import { SetToast } from "../Toaster";

export const YES = "Yes";
export const NO = "No";

interface EditFieldClickFunction {
  (e: React.MouseEvent<HTMLElement, MouseEvent>, field: Field): void;
}
interface DeleteFieldClickFunction {
  (e: React.MouseEvent<HTMLElement, MouseEvent>, fieldId: string): void;
}

export interface EditFieldsTableProps {
  fields: Field[];
  onEditClick: EditFieldClickFunction;
  onDeleteClick: DeleteFieldClickFunction;
  setToast?: SetToast;
}

export const EditFieldsTable: FC<EditFieldsTableProps> = ({
  fields,
  onEditClick,
  onDeleteClick,
  setToast,
}): ReactElement => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">{NAME_LABEL}</th>
          <th scope="col">{TYPE_LABEL}</th>
          <th scope="col">{TYPE_OPTION_LABEL}</th>
          <th scope="col">{REQUIRED_LABEL}</th>
          <th scope="col" style={{ width: "20%" }}>
            {ACTIONS}
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field: Field) => (
          <tr key={field.id} style={{ verticalAlign: MIDDLE }}>
            <td>{field.name}</td>
            <td>{field.type}</td>
            <td>
              {(getNewFieldState(field.type)).typeOptions ? field.option : ""}
            </td>
            <td>{field.required ? YES : NO}</td>
            <td>
              <Dropdown>
                <Dropdown.Toggle
                  variant={SECONDARY}
                  id="dropdown-basic"
                  size={SM}
                >
                  {ACTIONS}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      onEditClick(e, field);
                    }}
                  >
                    {EDIT_LABEL}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={TEXT_DANGER}
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteClick(e, field.id);
                      if (setToast) {
                        setToast({
                        show: true,
                        content: `Field deleted.`,
                        name: field.name,
                      });
                    }
                    }}
                  >
                    {DELETE}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditFieldsTable;
