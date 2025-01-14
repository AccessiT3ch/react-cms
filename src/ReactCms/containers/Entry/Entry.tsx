import React, { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Formik } from "formik";

import store from "../../../store/store";

import { Model, Field, Entry as EntryType, ValueTypes, FieldTextType, FieldSelectType, FieldNumberRangeType, FieldNumberType, FieldDateType, FieldBooleanType, ContainerProps, getHomeURL } from "../../settings";
import {addEntry, getEntry, updateEntry, getModel } from "../../reducer";

import { Header } from "../../../App/components/Header";
import { FieldText } from "../../components/FieldText";
import { FieldNumber } from "../../components/FieldNumber";
import { FieldDate } from "../../components/FieldDate";
import { FieldBoolean } from "../../components/FieldBoolean";
import { FieldSelect } from "../../components/FieldSelect";

import {
  BOOLEAN,
  CANCEL,
  DATE,
  getEditModelURL,
  MODEL_NOT_FOUND,
  NUMBER,
  OOPS,
  PRIMARY,
  RESET,
  SECONDARY,
  SELECT,
  SUBMIT,
  SUBMIT_STRING,
  TEXT,
  WARNING,
} from "../../settings";
import "./Entry.scss";

// Magic strings
export const LABEL = "label";

// Display strings
export const ENTRY_HEADER = " Entry";
export const ENTRY_LABEL = "Entry Label";
export const NO_MODEL_FIELDS = "This model doesn't have any fields yet";
export const ENTRY_NOT_SAVED = "Entry not saved";
export const ENTRY_NOT_UPDATED = "Entry not updated";

/**
 *  Entry Submission Callback
 */
export interface OnEntrySubmitParams {
  values: { [fieldId: string]: ValueTypes; label: string };
  model: Model;
  entry: EntryType;
}
export const onEntrySubmit = async ({
  values,
  model,
  entry,
}: OnEntrySubmitParams) => {
  const entryId: string = entry && entry.id ? entry.id : uuidv4();
  const newValues = {
    ...values,
  };

  const newEntry: EntryType = {
    ...entry,
    id: entryId,
    values: newValues,
  };

  await store.dispatch(
    (entry ? updateEntry : addEntry)({
      modelId: model.id,
      entryId,
      entry: newEntry,
    })
  );
};

export interface EntryValues {
  [fieldId: string]: ValueTypes;
  label: string;
}

export const Entry: FC<ContainerProps> = ({
  setToast,
  basename = "",
}): ReactElement | null => {
  const navigate = useNavigate();

  // Get model and entry from store
  const { id: modelId, entry: entryId } = useParams() as {
    id: string;
    entry: string;
  };
  const model: Model = getModel(store.getState(), modelId);
  const entry: EntryType = getEntry(store.getState(),modelId, entryId);
  const { name, fields, labelOption } = model || {};
  const fieldsArray: Field[] = Object.values(fields || {});

  // Page state
  const [cancel, setCancel] = React.useState(false);
  const [isNewEntry] = React.useState(
    typeof entryId === "undefined" || typeof entry === "undefined"
  );

  React.useEffect(() => {
    // If model doesn't exist, redirect to Home
    if (!model) {
      navigate(getHomeURL(basename));
      if (setToast) {
        setToast({
        show: true,
        name: OOPS,
        context: MODEL_NOT_FOUND,
        status: WARNING,
      });
    }
    } else if (!fieldsArray.length) {
      // If model doesn't have any fields, redirect to Edit page
      if (setToast) {
        setToast({
        show: true,
        content: `No fields found.`,
        status: WARNING,
      });
    }
      navigate(getEditModelURL(modelId));
    }
  }, [model, modelId, navigate, fieldsArray.length]);

  React.useEffect(() => {
    // If cancel is true, redirect to back
    if (cancel) {
      navigate(-1);
    }
  }, [cancel, navigate]);

  // populate initial entry values
  const initialValues = {} as any;
  for (const f of fieldsArray) {
    initialValues[f.id] = isNewEntry ? f.defaultValue : entry.values[f.id];
  }

  return !model || !fieldsArray.length ? null : (
    <>
      <Container>
        <Row>
          <Col>
            <Header
              title={`${name}${ENTRY_HEADER}`}
            />
            <hr />
          </Col>
        </Row>
        <Formik
          initialValues={initialValues}
          // todo: add validation
          onSubmit={(values) => {
            onEntrySubmit({ values, model, entry, });
            setCancel(true);
            if (setToast) {
                setToast({
                show: true,
                name: model.name,
                content: isNewEntry
                  ? `New entry added`
                  : `Entry updated`,
              })
            }
          }}
        >
          {(formikProps) => {
            const isTextLabel = labelOption === TEXT;
            return (
              <Form
                onSubmit={formikProps.handleSubmit}
                className="form__model_entry"
              >
                <Row>
                  <Col>
                    {isTextLabel && (
                      <Form.Group className="entry__field_container">
                        <Form.Label>{ENTRY_LABEL}</Form.Label>
                        <Form.Control
                          type={TEXT}
                          name={LABEL}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          value={formikProps.values.label}
                        />
                      </Form.Group>
                    )}
                    {fieldsArray.map((field: Field) => {
                      const { id, type } = field;

                      return (
                        <Form.Group key={id} className="entry__field_container">
                          {type === TEXT && (
                            <FieldText {...formikProps} field={field as FieldTextType} />
                          )}
                          {type === NUMBER && (
                            <FieldNumber {...formikProps} field={field as FieldNumberType | FieldNumberRangeType} />
                          )}
                          {type === DATE && (
                            <FieldDate {...formikProps} field={field as FieldDateType} />
                          )}
                          {type === BOOLEAN && (
                            <FieldBoolean {...formikProps} field={field as FieldBooleanType} />
                          )}
                          {type === SELECT && (
                            <FieldSelect {...formikProps} field={field as FieldSelectType} />
                          )}
                        </Form.Group>
                      );
                    })}
                  </Col>
                </Row>

                <Row className="form__button_row">
                  <Col>
                    <Button
                      variant={SECONDARY}
                      type={RESET}
                      onClick={() => {
                        setCancel(true);
                        if (setToast) {
                          setToast({
                            show: true,
                            name: model.name,
                            context: isNewEntry
                              ? `Entry not saved`
                              : `Entry not updated`,
                            status: SECONDARY,
                          });
                        }
                      }}
                    >
                      {CANCEL}
                    </Button>
                  </Col>
                  <Col>
                    <Button variant={PRIMARY} type={SUBMIT}>
                      {SUBMIT_STRING}
                    </Button>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </>
  );
};

export default Entry;
