import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Model, Field } from "../../settings";
import { OnUpdateModelParams } from "../../containers/Edit"; // todo - move into slice

import {
  DATE,
  DATE_LABEL,
  DEFAULTS,
  FIELDS,
  LABEL_OPTION,
  PRIMARY,
  SAVE,
  SELECT,
  SUBMIT,
  TEXT,
  TEXT_LABEL,
} from "../../../strings";

export const ENTRY_LABEL = "Entry Label";

export interface EditLabelFormProps {
  model: Model;
  onSubmit: (params: OnUpdateModelParams) => void;
}

export const EditLabelForm: FC<EditLabelFormProps> = ({
  model,
  onSubmit,
}): ReactElement => {
  const { fields } = model as Model;
  const initialValues = {
    labelOption: model.labelOption || DATE,
  } as Model & { [key: string]: string };
  const Field: Field[] = Object.values(fields || {});
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) =>
        onSubmit({ model, values, })
      }
    >
      {(formikProps) => {
        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <Form.Label>{ENTRY_LABEL}</Form.Label>
            <InputGroup>
              <Form.Control
                as={SELECT}
                name={LABEL_OPTION}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.labelOption}
                required
              >
                <optgroup label={DEFAULTS}>
                  <option value={DATE}>{DATE_LABEL}</option>
                  <option value={TEXT}>{TEXT_LABEL}</option>
                </optgroup>
                <optgroup label={FIELDS}>
                  {Field.map((field) => (
                    <option key={`label-options-${field.id}`} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </optgroup>
              </Form.Control>

              <Button
                variant={PRIMARY}
                type={SUBMIT}
                disabled={formikProps.values.labelOption === model.labelOption}
              >
                {SAVE}
              </Button>
            </InputGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditLabelForm;
