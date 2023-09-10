import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { InputGroup, Form, Button, Row, Col } from "react-bootstrap";

import { Model, Field } from "../../settings";

import { OnUpdateModelParams } from "../../containers/Edit"; // todo - move into slice

import {
  CREATED_AT,
  FIELDS,
  ORDER,
  PRIMARY,
  SAVE,
  SELECT,
  SORT,
  SORT_ASC,
  SORT_DESC,
  SUBMIT,
} from "../../settings/strings";

export const SORT_BY = "Sort By";
export const SORT_ORDER = "Sort Order";
export const DATE_CREATED = "Date Created";

export interface EditSortFormProps {
  model: Model;
  onSubmit: (params: OnUpdateModelParams) => void;
}

export const EditSortForm: FC<EditSortFormProps> = ({
  model,
  onSubmit,
}): ReactElement => {
  const { fields } = model as Model;
  const initialValues = {
    sort: model.sort || CREATED_AT,
    order: model.order || SORT_DESC,
  } as Model & { [key: string]: string };
  const fieldsArray: Field[] = Object.values(fields || {});
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
            <Form.Label>{SORT_BY}</Form.Label>
            <Row>
              <Col>
                <InputGroup>
                  <Form.Control
                    as={SELECT}
                    name={SORT}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.sort}
                  >
                    <option value={CREATED_AT}>{DATE_CREATED}</option>
                    <optgroup label={FIELDS}>
                      {fieldsArray.map((field) => (
                        <option
                          key={`sort-options-${field.id}`}
                          value={field.id}
                        >
                          {field.name}
                        </option>
                      ))}
                    </optgroup>
                  </Form.Control>
                  <Button
                    id="sort-submit"
                    variant={PRIMARY}
                    type={SUBMIT}
                    disabled={formikProps.values.sort === model.sort}
                  >
                    {SAVE}
                  </Button>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <Form.Control
                    as={SELECT}
                    name={ORDER}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.order}
                  >
                    <option value={SORT_DESC}>Forward</option>
                    <option value={SORT_ASC}>Reversed</option>
                  </Form.Control>
                  <Button
                    id="sort-order-submit"
                    variant={PRIMARY}
                    type={SUBMIT}
                    disabled={formikProps.values.order === model.order}
                  >
                    {SAVE}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};
