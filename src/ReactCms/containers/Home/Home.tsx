import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.scss";
import { Button, ButtonGroup, Dropdown, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ContainerProps, getHomeURL, initialModelState } from "../../settings";
import { addModel, removeModel, getModelsArray } from "../../reducer";
import { v4 as uuidv4 } from "uuid";

import { Header } from "../../../App/components/Header";

import store from "../../../store/store";
import {
  ADD_ENTRY,
  CANCEL,
  EMPTY,
  getAddEntryURL,
  getEditModelURL,
  NEW_URL,
  PRIMARY,
  SAVE,
  SECONDARY,
  TEXT,
  TEXT_DANGER,
} from "../../settings";

export const REACT_CMS = "React CMS";
export const MODELS_LABEL = "Models";
export const MODEL_LABEL = "Model";
export const MODEL_NAME = "Model Name";
export const MODEL_NAME_PLACEHOLDER = "Enter model name";
export const ACTIONS = "Actions";
export const EDIT = "Edit";
export const DELETE = "Delete";
export const NO_MODELS_YET = "No models yet.";
export const CREATE_NEW_MODEL = "Create a new model...";
export const ENTRIES = "Entries";
export const FIELDS = "Fields";

export interface onAddModelParams {
  id: string;
  name: string;
}
export const onAddModel = async ({
    id,
    name,
}: onAddModelParams) => {
  const model = {
    ...initialModelState,
    name,
    id,
  };
  store.dispatch(addModel({ model }));
};

export const Home: FC<ContainerProps> = ({ setToast, basename = "" }): ReactElement => {
  const navigate = useNavigate();

  const isNewModelModalOpen = window.location.hash === "#/new";
  const [showModal, setShowModal] = React.useState(isNewModelModalOpen);
  const [newModelId, setNewModelId] = React.useState(EMPTY);
  const [newModelName, setNewModelName] = React.useState(EMPTY);
  const models = getModelsArray(store.getState());

  if (
    newModelId !== EMPTY &&
    newModelName !== EMPTY &&
    newModelName.trim() !== EMPTY
  ) {
    navigate(getEditModelURL(newModelId));
  }

  return (
    <Container>
      <Row className="header__row">
        <Col>
          <Header title={REACT_CMS} />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
          <h2>{MODELS_LABEL}</h2>

          {/* todo: convert to cards */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{MODEL_LABEL}</th>
                <th>{ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {models &&
                models.length > 0 &&
                models.map((model) => (
                  // todo: extract to component
                  <tr key={model.id}>
                    <td>
                      <Link to={`${basename}/model/${model.id}`}>{model.name}</Link>
                    </td>
                    <td>
                      <Dropdown
                        as={ButtonGroup}
                        id={`table__dropdown_button__${model.id}`}
                        className="table__dropdown_button"
                      >
                        <Button
                          variant={PRIMARY}
                          onClick={() => navigate(getAddEntryURL(model.id))}
                        >
                          {ADD_ENTRY}
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant={PRIMARY}
                          id={`table__dropdown_toggle__${model.id}`}
                          className="table__dropdown_toggle"
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => navigate(getEditModelURL(model.id))}
                          >
                            {EDIT}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className={TEXT_DANGER}
                            onClick={(e) => {
                              e.preventDefault();
                              store.dispatch(removeModel({ modelId: model.id }));
                              if (setToast) {
                                setToast({
                                  show: true,
                                  content: `Model "${model.name}" deleted.`,
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
          {models && models.length === 0 && <p>{NO_MODELS_YET}</p>}

          <Button
            variant={PRIMARY}
            onClick={(e) => {
              e.preventDefault();
              navigate(NEW_URL);
              setShowModal(true);
            }}
          >
            {CREATE_NEW_MODEL}
          </Button>
        </Col>
      </Row>

      {/* todo: extract to component */}
      <Modal
        id="addModelModal"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewModelName(EMPTY);
          navigate(getHomeURL(basename));
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{CREATE_NEW_MODEL}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLogName">
              <Form.Label>{MODEL_NAME}</Form.Label>
              <Form.Control
                type={TEXT}
                placeholder={MODEL_NAME_PLACEHOLDER}
                onChange={(e) => setNewModelName(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <Button
                  variant={SECONDARY}
                  onClick={() => {
                    setShowModal(false);
                    setNewModelName(EMPTY);
                    navigate(getHomeURL(basename));
                  }}
                >
                  {CANCEL}
                </Button>
              </Col>
              <Col>
                <Button
                  variant={PRIMARY}
                  disabled={newModelName.trim() === EMPTY}
                  onClick={async () => {
                    const newId = uuidv4();
                    await onAddModel({
                      id: newId,
                      name: newModelName,
                    });
                    setNewModelId(newId);
                    navigate(getEditModelURL(newId));
                    if (setToast) {
                      setToast({
                        show: true,
                        content: `Model "${newModelName}" created.`
                      });
                    }
                  }}
                >
                  {SAVE}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Home;
