import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, InputGroup } from "react-bootstrap";

import { Model } from "../../settings";
import { OnUpdateModelParams } from "../../containers/Edit"; // todo - move into slice

import { EMPTY, PRIMARY, SAVE, SUBMIT, TEXT, TEXT_DANGER } from "../../../strings";

export const NAME = "name";

export const NAME_IS_REQUIRED = "Name is required";
export const NAME_IS_SPACES = "Name cannot be spaces";
export const MODEL_NAME = "Model Name";

export const ModelNameFormValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required(NAME_IS_REQUIRED)
    .test(
      "is-valid-name",
      NAME_IS_SPACES,
      (value) => typeof value !== "undefined" && value.trim().length > 0
    ),
});

export interface ModelNameFormProps {
  model: Model;
  onSubmit: (params: OnUpdateModelParams) => void;
}

export interface ModelNameFormValues {
  name: string;
}

export const ModelNameForm: FC<ModelNameFormProps> = ({
  onSubmit,
  model,
}): ReactElement => {
  const initialValues = {
    name: model.name || EMPTY,
  } as ModelNameFormValues;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) =>
        onSubmit({ model, values, })
      }
      validationSchema={ModelNameFormValidationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="edit__form_row">
          <Form.Label htmlFor={"modelNameFormInput"}>{MODEL_NAME}</Form.Label>
          <InputGroup>
            <Form.Control
              type={TEXT}
              name={NAME}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              id="modelNameFormInput"
            />
            <Button
              variant={PRIMARY}
              type={SUBMIT}
              disabled={
                Object.keys(errors).length > 0 || values.name === model.name
              }
            >
              {SAVE}
            </Button>
          </InputGroup>
          {touched.name && errors.name && (
            <Form.Text className={TEXT_DANGER}>{errors.name as string}</Form.Text>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default ModelNameForm;
