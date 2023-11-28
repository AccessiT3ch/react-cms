import React, { FC, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { EMPTY, SUCCESS, WILDCARD } from "../ReactCms/settings/strings";
import { Toaster, ToastType } from "../ReactCms/components/Toaster";
import { getReactCmsRoutes } from "../ReactCms/routes";

export const App: FC = (): ReactElement => {

  const [toast, setToast] = React.useState({
    show: false,
    context: EMPTY,
    name: EMPTY,
    status: SUCCESS,
  } as ToastType);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={WILDCARD} element={<h1>404</h1>} />
          {getReactCmsRoutes({ setToast, basename: "/cms" })}
        </Routes>
      </BrowserRouter>
      <Toaster toast={toast} setToast={setToast} />
    </>
  );
};

export default App;
