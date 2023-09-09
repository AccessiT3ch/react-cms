import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.scss";
import { Button, ButtonGroup, Dropdown, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  addLogEntry,
  addLogField,
  ADD_LOG_ACTION,
  initialFieldStates,
  initialLogState,
  LogEntry,
  LogField,
  removeLog,
  REMOVE_LOG_ACTION,
  getLogsArray,
} from "../../store/Log";
import { v4 as uuidv4 } from "uuid";

import { Header } from "../../components/Header";

import store from "../../store/store";
import { addLog } from "../../store/Log";
import {
  ADD_ENTRY,
  CANCEL,
  CHECKBOX,
  CREATED_AT,
  DOT_CSV,
  EMPTY,
  FILE,
  getAddLogEntryURL,
  getEditLogURL,
  HOME_URL,
  ID,
  NEW_URL,
  PRIMARY,
  SAVE,
  SECONDARY,
  TEXT,
  TEXT_DANGER,
  UPDATED_AT,
} from "../../strings";
import { SetToast } from "../../components/Toaster";
import { parseCSV } from "../../utils";

export const TRACKER_KEEPER = "Tracker Keeper";
export const YOUR_LOGS = "Your Logs";
export const LOG = "Log";
export const LOG_NAME = "Log Name";
export const LOG_NAME_PLACEHOLDER = "Enter log name";
export const ACTIONS = "Actions";
export const EDIT = "Edit";
export const DELETE = "Delete";
export const NO_LOGS_YET = "No logs yet.";
export const CREATE_NEW_LOG = "Create a new log...";
export const RESTORE_LOG = "Restore log from CSV";
export const LOG_ENTRIES = "Log Entries";
export const LOG_FIELDS = "Log Fields";

export interface onAddLogParams {
  id: string;
  name: string;
}
export const onAddLog = async ({
    id,
    name,
}: onAddLogParams) => {
  const log = {
    ...initialLogState,
    name,
    id,
  };
  store.dispatch(addLog({ log }));
};

export interface HomeProps {
  setToast: SetToast;
}

export const Home: FC<HomeProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();

  const isNewLogModalOpen = window.location.hash === "#/new";
  const [showModal, setShowModal] = React.useState(isNewLogModalOpen);
  // const [showExportModal, setShowExportModal] = React.useState(false);
  // const [exportID, setExportID] = React.useState("");
  const [restoreLog, setRestoreLog] = React.useState(false);
  const [restoredFields, setRestoredFields] = React.useState([]);
  const [restoredEntries, setRestoredEntries] = React.useState([]);
  const [newLogId, setNewLogId] = React.useState(EMPTY);
  const [newLogName, setNewLogName] = React.useState(EMPTY);
  const logs = getLogsArray(store.getState());

  if (
    newLogId !== EMPTY &&
    newLogName !== EMPTY &&
    newLogName.trim() !== EMPTY
  ) {
    navigate(getEditLogURL(newLogId));
  }

  return (
    <Container>
      <Row className="header__row">
        <Col>
          <Header title={TRACKER_KEEPER} />
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
          <h2>{YOUR_LOGS}</h2>

          {/* todo: convert to cards */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>{LOG}</th>
                <th>{ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {logs &&
                logs.length > 0 &&
                logs.map((log) => (
                  // todo: extract to component
                  <tr key={log.id}>
                    <td>
                      <Link to={`/log/${log.id}`}>{log.name}</Link>
                    </td>
                    <td>
                      <Dropdown
                        as={ButtonGroup}
                        id={`table__dropdown_button__${log.id}`}
                        className="table__dropdown_button"
                      >
                        <Button
                          variant={PRIMARY}
                          onClick={() => navigate(getAddLogEntryURL(log.id))}
                        >
                          {ADD_ENTRY}
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant={PRIMARY}
                          id={`table__dropdown_toggle__${log.id}`}
                          className="table__dropdown_toggle"
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => navigate(getEditLogURL(log.id))}
                          >
                            {EDIT}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className={TEXT_DANGER}
                            onClick={(e) => {
                              e.preventDefault();
                              store.dispatch(removeLog({ logId: log.id }));
                              setToast({
                                show: true,
                                context: REMOVE_LOG_ACTION,
                                name: log.name,
                              });
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
          {logs && logs.length === 0 && <p>{NO_LOGS_YET}</p>}

          <Button
            variant={PRIMARY}
            onClick={(e) => {
              e.preventDefault();
              navigate(NEW_URL);
              setShowModal(true);
            }}
          >
            {CREATE_NEW_LOG}
          </Button>
        </Col>
      </Row>

      {/* todo: extract to component */}
      <Modal
        id="addLogModal"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setRestoreLog(false);
          setRestoredFields([]);
          setRestoredEntries([]);
          setNewLogName(EMPTY);
          navigate(HOME_URL);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{CREATE_NEW_LOG}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLogName">
              <Form.Label>{LOG_NAME}</Form.Label>
              <Form.Control
                type={TEXT}
                placeholder={LOG_NAME_PLACEHOLDER}
                onChange={(e) => setNewLogName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="restoreLog">
              <Form.Check
                type={CHECKBOX}
                label={RESTORE_LOG}
                onChange={(e) => setRestoreLog(e.target.checked)}
              />
            </Form.Group>
            {restoreLog && (
              <>
                <Form.Group controlId="formFieldData">
                  <Form.Label>{LOG_FIELDS}</Form.Label>
                  <Form.Control
                    type={FILE}
                    accept={DOT_CSV}
                    required
                    onChange={(e) => {
                      const file = (e.target as any).files[0];
                      setRestoredFields([]);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const result = reader.result;
                          const fields = parseCSV(result as string).map(
                            (field) => {
                              const newField = {
                                ...initialFieldStates[field.type],
                                ...field,
                              };
                              return newField;
                            }
                          );
                          setRestoredFields(fields as []);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="formEntryData">
                  <Form.Label>{LOG_ENTRIES}</Form.Label>
                  <Form.Control
                    type={FILE}
                    accept={DOT_CSV}
                    required
                    onChange={(e) => {
                      const file = (e.target as any).files[0];
                      setRestoredEntries([]);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const result = reader.result;
                          const entries = parseCSV(result as string).map(
                            (entry) => {
                              const newEntry = {
                                id: entry.ID,
                                createdAt: entry.createdAt,
                                updatedAt: entry.updatedAt,
                                values: {
                                  label: entry.label,
                                },
                              } as LogEntry;
                              Object.keys(entry).forEach((key) => {
                                if (
                                  key !== ID &&
                                  key !== CREATED_AT &&
                                  key !== UPDATED_AT
                                ) {
                                  newEntry.values[key] = entry[key];
                                }
                              });
                              return newEntry;
                            }
                          );

                          setRestoredEntries(entries as []);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </Form.Group>
              </>
            )}
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
                    setNewLogName(EMPTY);
                    setRestoreLog(false);
                    setRestoredFields([]);
                    setRestoredEntries([]);
                    navigate(HOME_URL);
                  }}
                >
                  {CANCEL}
                </Button>
              </Col>
              <Col>
                <Button
                  variant={PRIMARY}
                  disabled={
                    newLogName.trim() === EMPTY ||
                    (restoreLog &&
                      (!restoredFields.length || !restoredEntries.length))
                  }
                  onClick={async () => {
                    const newId = uuidv4();
                    await onAddLog({
                      id: newId,
                      name: newLogName,
                    });
                    setNewLogId(newId);
                    if (restoreLog) {
                      Object.values(restoredFields).forEach(
                        (field: LogField) => {
                          store.dispatch(
                            addLogField({
                              logId: newId,
                              fieldId: field.id,
                              field,
                            })
                          );
                        }
                      );

                      Object.values(restoredEntries).forEach(
                        (entry: LogEntry) => {
                          store.dispatch(
                            addLogEntry({
                              logId: newId,
                              entry,
                            })
                          );
                        }
                      );
                    } else {
                      navigate(getEditLogURL(newId));
                    }

                    setToast({
                      show: true,
                      context: ADD_LOG_ACTION,
                      name: newLogName,
                    });
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
