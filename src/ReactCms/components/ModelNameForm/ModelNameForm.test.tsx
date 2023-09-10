import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { ModelNameForm, ModelNameFormProps, MODEL_NAME } from "./ModelNameForm";
import { initialModelState } from "../../settings";
import { SAVE, TEXT_DANGER } from "../../../strings";

test("renders without crashing", () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  render(<ModelNameForm {...props} />);
});

test("renders with an input for the model name", () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByLabelText, } = render(<ModelNameForm {...props} />);
  const label = getByLabelText(MODEL_NAME);
  expect(label).toBeInTheDocument();
  const input = document.getElementById("modelNameFormInput")
  expect(input).toBeInTheDocument();
  expect(input).toHaveValue("Test");
});

test("renders with a submit button", () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = render(<ModelNameForm {...props} />);
  const button = getByText(SAVE);
  expect(button).toBeInTheDocument();
});

test("enables the submit button when the input is not empty", async () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = await act(async () => render(<ModelNameForm {...props} />));
  const user =  userEvent.setup();
  const input = document.getElementById("modelNameFormInput")
  const button = getByText(SAVE);
  expect(button).toBeDisabled();
  
  await user.type(input!, "Test Name");
  expect(input).toHaveValue("Test Name");
  expect(button).toBeEnabled();
});

test("calls the onSubmit function when the form is submitted", async () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = await act(async () => render(<ModelNameForm {...props} />));
  const input = document.getElementById("modelNameFormInput")
  const button = getByText(SAVE);
  const user = userEvent.setup();

  expect(props.onSubmit).not.toHaveBeenCalled();
  await user.type(input!, "Test Name");

  await act(async () => {
    button.click();
  });

  expect(props.onSubmit).toHaveBeenCalled();
});

test("renders error message when the input is invalid", async () => {
  const props: ModelNameFormProps = {
    model: {
      ...initialModelState,
      name: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  await act(async () => render(<ModelNameForm {...props} />));
  const input = document.getElementById("modelNameFormInput");
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(0);
  await act(() => input!.focus());
  await act(() => input!.blur());
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(1);

  const user = userEvent.setup();
  await user.type(input!, "Test Name");
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(0);
});