import React, { FC, ReactElement } from "react";
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { Header } from "../../../App/components/Header";

import store from "../../../store/store";
import {
  removeEntry,
  getModel
} from "../../reducer";
import {
  Model as ModelType,
  Entry,
} from "../../settings";
import "./Model.scss";
import {
  ACTIONS,
  ADD_ENTRY,
  BOOLEAN,
  CREATED_AT,
  DARK,
  DATE,
  DELETE_ENTRY,
  EDIT_ENTRY,
  EDIT_MODEL,
  getAddEntryURL,
  getEditEntryURL,
  getEditModelURL,
  HOME,
  HOME_URL,
  HYPHEN,
  OOPS,
  PRIMARY,
  SECONDARY,
  SELECT,
  SORT_ASC,
  SORT_DESC,
  TEXT,
  WARNING,
} from "../../settings";
import { SetToast, ToastType } from "../../components/Toaster";
import { entryFilter, EntryFilter } from "../../components/EntryFilter";

// Display strings
export const ENTRIES_HEADER = "Entries ";
export const NO_ENTRIES = "No entries";
export const SORT_BY = "Sort by";
export const DATE_CREATED = "Date Created";
export const REVERSED = "Reversed";

export interface onDeleteEntryParams {
  model: ModelType;
  entryId: string;
}

export const onDeleteEntry = async ({
  model, 
  entryId,
}: onDeleteEntryParams) => {
  await store.dispatch(removeEntry({ modelId: model.id, entryId }));
};

export interface ModelProps {
  setToast: SetToast;
}

export const Model: FC<ModelProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();

  // Get model from store
  const { id } = useParams() as { id: string };
  const model: ModelType = getModel(store.getState(), id);
  const { name, fields, labelOption, sort, order } = model || {};

  // Set and sidebar states
  const [sortBy, setSortBy] = React.useState(sort || CREATED_AT);
  const [sortOrder, setSortOrder] = React.useState(order || SORT_DESC);
  const [filter, setFilter] = React.useState([] as any);

  // Define entries
  const entries: Entry[] = model
    ? Object.values(model.entries || {}).filter((entry: Entry) =>
      entryFilter(entry, filter)
    )
    : [];
  const hasEntries = entries.length > 0;

  // React.useEffect(() => {
  //   // todo: sync model metadata; sync model entries
  // }, []);

  // Navigate to home if model not found
  React.useEffect(() => {
    if (!model) {
      navigate(HOME_URL);
      setToast({
        show: true,
        name: OOPS,
        context: "Model not found",
        status: WARNING,
      });
    }
  }, [model, navigate]);

  const isLabelDate = labelOption === DATE;
  const isLabelText = labelOption === TEXT;

  return (
    <Container className="model__container">
      <Row>
        <Col>
          <Header title={name} />
        </Col>
      </Row>
      <hr />

      <Row>
        <Col className="model__entries_header">
          <h4>
            {ENTRIES_HEADER}
            {`(${entries.length})`}
          </h4>

          <div className="model__entries_header__actions">
            {/* Sort by dropdown */}
            <DropdownButton
              id="dropdown-basic-button"
              title={SORT_BY}
              variant={SECONDARY}
              className="model__actions"
            >
              <Dropdown.Item
                onClick={() => {
                  setSortBy(CREATED_AT);
                }}
                className={`text-${CREATED_AT === sortBy ? PRIMARY : SECONDARY
                  }`}
              >
                {DATE_CREATED}
              </Dropdown.Item>
              {Object.values(fields).map((field) => (
                <Dropdown.Item
                  key={`sort-by-${field.id}`}
                  onClick={() => {
                    setSortBy(field.id);
                  }}
                  className={`text-${field.id === sortBy ? PRIMARY : SECONDARY
                    }`}
                >
                  { field.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => {
                  setSortOrder(sortOrder === SORT_ASC ? SORT_DESC : SORT_ASC);
                }}
                className={`text-${sortOrder === SORT_ASC ? PRIMARY : SECONDARY
                  }`}
              >
                {REVERSED}
              </Dropdown.Item>
            </DropdownButton>

            <EntryFilter model={model} setFilter={setFilter} />
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="model__entries">
          {hasEntries ? (
            entries
              // todo: extract sort logic to helpers
              .sort((a: Entry, b: Entry) => {
                const valueA =
                  sortBy === CREATED_AT ? a[sortBy] : a.values[sortBy];
                const valueB =
                  sortBy === CREATED_AT ? b[sortBy] : b.values[sortBy];
                if (sortBy === CREATED_AT) {
                  const createdAtOrder =
                    sortOrder === SORT_ASC
                      ? new Date(valueB as string).getTime() -
                      new Date(valueA as string).getTime()
                      : new Date(valueA as string).getTime() -
                      new Date(valueB as string).getTime();
                  return createdAtOrder;
                }
                if (typeof valueA === "string" && typeof valueB === "string") {
                  const stringOrder =
                    sortOrder === SORT_ASC
                      ? valueA.localeCompare(valueB)
                      : valueB.localeCompare(valueA);
                  return stringOrder;
                }
                if ((valueA as any) < (valueB as any)) {
                  const genericOrder = sortOrder === SORT_ASC ? -1 : 1;
                  return genericOrder;
                } else if ((valueA as any) > (valueB as any)) {
                  const genericOrder = sortOrder === SORT_ASC ? 1 : -1;
                  return genericOrder;
                }
                return 0;
              })
              // todo: extract card to component
              .map((entry: Entry) => {
                const labelText = isLabelDate
                  ? new Date(entry.createdAt as string).toLocaleString()
                  : isLabelText
                    ? entry.values.label
                    : entry.values[labelOption as string];

                return (
                  <Card key={id + HYPHEN + entry.id} className="model__entry">
                    <Card.Body>
                      <Card.Title>{labelText}</Card.Title>

                      {Object.keys(entry.values)
                        .filter((fieldId: string) => fields[fieldId])
                        .map((fieldId: string) => {
                          let value;
                          const thisValue = (entry.values || {})[fieldId];
                          const thisField = fields[fieldId] || {};
                          switch (thisField.type) {
                            case BOOLEAN:
                              value = thisValue ? thisField.trueLabel : thisField.falseLabel;
                              break;
                            case SELECT:
                              value = Array.isArray(thisValue)
                                ? ((thisValue as []) || []).join(
                                  ", " // todo: make this dynamic
                                )
                                : thisValue;
                              break;
                            case DATE:
                            default:
                              value = thisValue;
                          }

                          return (
                            <div
                              key={id + HYPHEN + entry.id + HYPHEN + fieldId}
                              className="model__entry__field"
                            >
                              <strong>{fields[fieldId].name}</strong>:
                              {` ${value}`}
                            </div>
                          );
                        })}
                      <DropdownButton
                        id={`dropdown-basic-button-${id}-${entry.id}`}
                        title={ACTIONS}
                        variant={SECONDARY}
                        className="model__entry__actions"
                      >
                        <Dropdown.Item
                          onClick={() =>
                            navigate(getEditEntryURL(id, entry.id))
                          }
                        >
                          {EDIT_ENTRY}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            onDeleteEntry({
                              model,
                              entryId: entry.id,
                            });
                            setToast({
                              show: true,
                              content: `Entry deleted`,
                            } as ToastType);
                          }}
                        >
                          {DELETE_ENTRY}
                        </Dropdown.Item>
                      </DropdownButton>
                    </Card.Body>
                  </Card>
                );
              })
          ) : (
            <p>{NO_ENTRIES}</p>
          )}
        </Col>
      </Row>
      <hr />
      {/* todo: extract to component */}
      <Row className="form__button_row">
        <Col>
          <Button
            variant={DARK}
            onClick={() => {
              navigate(HOME_URL);
            }}
          >
            {HOME}
          </Button>
        </Col>
        <Col>
          <Button
            variant={SECONDARY}
            onClick={() => {
              navigate(getEditModelURL(id));
            }}
          >
            {EDIT_MODEL}
          </Button>
        </Col>
        <Col>
          <Button
            variant={PRIMARY}
            onClick={() => navigate(getAddEntryURL(id))}
          >
            {ADD_ENTRY}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Model;
