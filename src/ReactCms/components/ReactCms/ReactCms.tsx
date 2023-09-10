import { useState, FC, ReactElement } from "react";
import { Toaster, ToastType } from "../../components/Toaster";
import { Col, Container, Row } from "react-bootstrap";

export const EMPTY = "";
export const SUCCESS = "success";

export const ReactCms: FC = (): ReactElement => {

  const [toast, setToast] = useState({
    show: false,
    context: EMPTY,
    name: EMPTY,
    status: SUCCESS,
  } as ToastType);

  return (
    <Container>
      <Row>
        {/* Home - list of models */}
        <Col></Col>

        {/* Edit - list of fields */}
        <Col></Col>

        {/* Entries - list of Entrys */}
        <Col></Col>
      </Row>
      <Toaster toast={toast} setToast={setToast} />
    </Container>
  )
};
