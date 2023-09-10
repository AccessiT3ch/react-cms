import React, { FC, ReactElement } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { EMPTY, SUCCESS } from "../../settings/strings";
import "./toaster.scss";

export type ToastTypes =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "default"
  | "primary"
  | "secondary"
  | "light"
  | "dark";

export interface ToastType {
  content?: string;
  context?: string;
  status?: ToastTypes;
  name?: string;
  show?: boolean;
}

export interface Toasts {
  [context: string]: ToastType;
}

export type SetToast = React.Dispatch<React.SetStateAction<ToastType>>;

export interface ToasterProps extends ToastType {
  toast: ToastType;
  setToast: SetToast;
}

export const Toaster: FC<ToasterProps> = ({
  toast,
  setToast,
}): ReactElement => {
  const { show, context, name, status, content } = toast;
  const toastStatus: string = status || SUCCESS;
  const toastBody = content || context;

  return !toastBody ? (<></>) : (
    <ToastContainer>
      <Toast
        bg={toastStatus}
        show={show}
        onClose={() => {
          setToast({ show: false, context: EMPTY, name: EMPTY });
        }}
        autohide
        delay={3000}
      >
        <Toast.Header>
          <strong className="mr-auto">{name}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{toastBody}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
