import React, { FC, ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import store from "../../../store/store";
import { Model, Field } from "../../settings";
import { getModel, updateModel, removeModel, removeField } from "../../reducer";

import { ModelNameForm } from "../../components/ModelNameForm";
import { EditFieldsTable } from "../../components/EditFieldsTable";
import { EditFieldForm } from "../../components/EditField";
import { EditLabelForm } from "../../components/EditLabelForm";
import { Header } from "../../../App/components/Header";

import { SetToast } from "../../components/Toaster";
import { EditSortForm } from "../../components/EditSortForm";

import "./Edit.scss";

import {
  ADD,
  ADD_ENTRY,
  DANGER,
  DARK,
  EDIT,
  EMPTY,
  getAddLogEntryURL,
  getAddLogFieldURL,
  getEditLogFieldURL,
  getEditLogURL,
  getLogUrl,
  HOME,
  HOME_URL,
  MODAL,
  NEW,
  PRIMARY,
  SECONDARY,
  SUBMIT,
  VIEW_LOG,
} from "../../../strings";

export const EDIT_HEADER = "Edit: ";
export const LOG_FIELDS = "Log Fields";
export const NO_FIELDS_YET = "No fields yet.";
export const ADD_NEW_FIELD = "Add a new field...";
export const LOG_SETTINGS = "Log Settings";
export const DELETE_LOG = "Delete Log";
export const FIELD_SETTINGS = "Field Settings";

export interface OnUpdateModelParams {
  model: Model;
  values: {[key: string]: any};
}

export const onUpdateModel = async ({
  model,
  values,
}: OnUpdateModelParams): Promise<void> => {
  const updatedModel: Model = {
    ...model,
    ...values,
  };
  await store.dispatch(updateModel({ modelId: model.id, model: updatedModel }));
};


export const onDeleteModel = (model: Model) => {
  store.dispatch(removeModel({ modelId: model.id }));
};

export interface onDeleteFieldParams {
  model: Model;
  fieldId: string;
}
export const onDeleteField = async ({
  model,
  fieldId,
}:onDeleteFieldParams) => {
  await store.dispatch(removeField({ modelId: model.id, fieldId }));
};

export interface EditProps {
  setToast: SetToast;
}

export const Edit: FC<EditProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();

  // Get Model and Field ids from URL
  const { id, field } = useParams() as { id: string; field: string };

  // Get model from store
  const model: Model = getModel(store.getState(), id);

  // If model is not found, redirect to home
  if (!model || id !== model.id || !model.fields) {
    navigate(HOME_URL);
  }

  // Modal states
  const [showModal, setShowModal] = React.useState(field ? true : false);
  const [modalMode, setModalMode] = React.useState(
    field && field !== NEW ? EDIT : ADD
  ); // "add" or "edit"

  // Current field state
  const [fieldId, setFieldId] = React.useState(
    field && field !== NEW ? field : EMPTY
  );

  // Reset modal to initial state
  const resetModal = () => {
    setShowModal(false);
    navigate(getEditLogURL(id));
    setModalMode(ADD);
    setFieldId(EMPTY);
  };

  const onEditField = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    field: Field
  ) => {
    navigate(getEditLogFieldURL(id, field.id));
    setShowModal(true);
    setModalMode(EDIT);
    setFieldId(field.id);
  };

  const onAddField = () => {
    navigate(getAddLogFieldURL(id));
    setShowModal(true);
    setModalMode(ADD);
    setFieldId(EMPTY);
    // todo: sync log fields
  };

  const fields: Field[] = Object.values(model.fields);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Header
              title={EDIT_HEADER + model.name}
            />
          </Col>
        </Row>

        <Accordion
          alwaysOpen
          flush
          className="accordion__log_settings"
          defaultActiveKey={["0"]}
        >
          {/* LOG FIELDS TABLE */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h2>{LOG_FIELDS}</h2>
            </Accordion.Header>
            <Accordion.Body>
              {fields && fields.length ? (
                <EditFieldsTable
                  fields={fields}
                  onDeleteClick={(
                    e: React.MouseEvent<HTMLElement, MouseEvent>,
                    fieldId: string
                  ) => onDeleteField({ model, fieldId })}
                  onEditClick={onEditField}
                  setToast={setToast}
                />
              ) : (
                <p>{NO_FIELDS_YET}</p>
              )}
              <Button
                variant={PRIMARY}
                onClick={onAddField}
                data-toggle={MODAL}
                data-target="#addFieldModal"
                style={{ marginBottom: "1rem" }} // todo: move to scss
              >
                {ADD_NEW_FIELD}
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          {/* LOG SETTINGS */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>{LOG_SETTINGS}</h2>
            </Accordion.Header>
            <Accordion.Body>
              <ModelNameForm onSubmit={onUpdateModel} model={model} />
              <EditSortForm model={model} onSubmit={onUpdateModel} />
              {/* todo: Introduce Entry Settings subsection when there are multiple settings
              <hr className="edit__settings_hr" />
              <h3>Entry Settings</h3>
              <hr /> */}
              <br />
              <EditLabelForm model={model} onSubmit={onUpdateModel} />
              {/* todo: Implement recurrence and reminders when there is a backend
              <br />
              <EditRecurrenceForm log={log} onSubmit={onUpdateLog} /> */}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <h2>Danger Zone</h2>
            </Accordion.Header>
            <Accordion.Body>
              <Button
                variant={DANGER}
                type={SUBMIT}
                onClick={(e) => {
                  e.preventDefault();
                  setToast({
                    show: true,
                    content: `Model deleted`,
                    name: model.name,
                  });
                  onDeleteModel(model);
                  navigate(HOME_URL);
                }}
              >
                {DELETE_LOG}
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="form__button_row">
          <Col>
            <Button variant={DARK} onClick={() => navigate(HOME_URL)}>
              {HOME}
            </Button>
          </Col>
          <Col>
            <Button
              variant={SECONDARY}
              onClick={() => navigate(getLogUrl(model.id))}
            >
              {VIEW_LOG}
            </Button>
          </Col>
          <Col>
            <Button
              variant={PRIMARY}
              onClick={() => navigate(getAddLogEntryURL(model.id))}
            >
              {ADD_ENTRY}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Add Field Modal */}
      <Modal id="addFieldModal" show={showModal} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>{FIELD_SETTINGS}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditFieldForm
            fieldId={fieldId}
            model={model}
            modalMode={modalMode}
            resetModal={resetModal}
            setToast={setToast}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
