import React, { FC, ReactElement } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../ReactCms/containers/Home";
import { Edit } from "../ReactCms/containers/Edit";
import { Model } from "../ReactCms/containers/Model";
import { Entry } from "../ReactCms/containers/Entry";
import "./App.scss";
import { EDIT_URL, EMPTY, ENTRY_EDIT_URL, ENTRY_URL, FIELD_URL, HOME_URL, MODEL_ID_URL, MODEL_URL, NEW_URL, SUCCESS, WILDCARD } from "../ReactCms/settings/strings";
import { Toaster, ToastType } from "../ReactCms/components/Toaster";

export const App: FC = (): ReactElement => {

  const [toast, setToast] = React.useState({
    show: false,
    context: EMPTY,
    name: EMPTY,
    status: SUCCESS,
  } as ToastType);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path={WILDCARD} element={<h1>404</h1>} />
          <Route path={HOME_URL} element={<Home setToast={setToast} />} />
          <Route path={NEW_URL} element={<Home setToast={setToast} />} />
          <Route path={MODEL_URL}>
            <Route path={EMPTY} element={<h1>404</h1>} />
            <Route path={MODEL_ID_URL}>
              <Route path={EMPTY} element={<Model setToast={setToast} />} />
              <Route path={ENTRY_URL} element={<Entry setToast={setToast} />} />
              <Route
                path={ENTRY_EDIT_URL}
                element={<Entry setToast={setToast} />}
              />
              <Route path={EDIT_URL}>
                <Route path={EMPTY} element={<Edit setToast={setToast} />} />
                <Route
                  path={FIELD_URL}
                  element={<Edit setToast={setToast} />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </HashRouter>
      <Toaster toast={toast} setToast={setToast} />
    </>
  );
};

export default App;
