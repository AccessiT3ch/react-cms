import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditLabelFormProps, EditLabelForm } from "./EditLabelForm";
import { initialFieldTextState } from "../../settings";

describe("EditLabelForm", () => {
  test("renders without crashing", () => {
    const props: EditLabelFormProps = {
      model: {} as any,
      onSubmit: jest.fn(),
    };
    render(<EditLabelForm {...props} />);
  });

  test("renders correctly", () => {
    const props: EditLabelFormProps = {
      model: {
        fields: {
          "field1": { ...initialFieldTextState, id: "field1" },
          "field2": { ...initialFieldTextState, id: "field2" },
        }
      } as any,
      onSubmit: jest.fn(),
    };
    render(<EditLabelForm {...props} />);
    const labelSelect = document.querySelector("select[name='labelOption']");
    expect(labelSelect).toBeInTheDocument();
    const labelOptions = labelSelect?.querySelectorAll("option");
    expect(labelOptions?.length).toBe(Object.keys(props.model.fields).length + 2);
  });

  test("calls onSubmit when form is submitted", async () => {
    const props: EditLabelFormProps = {
      model: {} as any,
      onSubmit: jest.fn(),
    };
    const { getByText } = render(<EditLabelForm {...props} />);
    act(() => {
      getByText("Save").click();
    });
    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});