import { Route } from "react-router-dom";
import { Home } from "../ReactCms/containers/Home";
import { Edit } from "../ReactCms/containers/Edit";
import { Model } from "../ReactCms/containers/Model";
import { Entry } from "../ReactCms/containers/Entry";
import React, { Dispatch } from "react";
import { ToastType } from "../ReactCms/components/Toaster";

export interface ReactCmsRouteProps {
  setToast: Dispatch<React.SetStateAction<ToastType>>;
  basename?: string;
  path?: string;
}

export const HOME_URL = "/";
export const NEW_URL = "/new";
export const MODEL_URL = "/model";
export const MODEL_ID_URL = "/model/:id";
export const ENTRY_URL = "/model/:id/entry";
export const EDIT_ENTRY_URL = "/model/:id/entry/:entryId";
export const EDIT_MODEL_URL = "/model/:id/edit";
export const EDIT_FIELD_URL = "/model/:id/edit/:fieldId";

// Home Route
export const getHomeRoute = (
  { setToast,
    basename = "",
    path = HOME_URL,
  }: ReactCmsRouteProps
) => <Route path={basename + path} element={<Home setToast={setToast} basename={basename} />} />;

// Model Routes
export const getNewModelRoute = ({
  setToast,
  basename = "",
  path = NEW_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Home setToast={setToast} basename={basename} />} />;

export const getModelRoute = ({
  setToast,
  basename = "",
  path = MODEL_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Model setToast={setToast} basename={basename} />} />;

export const getModelIdRoute = ({
  setToast,
  basename = "",
  path = MODEL_ID_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Model setToast={setToast} basename={basename} />} />
);

export const getEditModelRoute = ({
  setToast,
  basename = "",
  path = EDIT_MODEL_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Edit setToast={setToast} basename={basename} />} />;

// Entry Routes
export const getEntryRoute = ({
  setToast,
  basename = "",
  path = ENTRY_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Entry setToast={setToast} basename={basename} />} />;

export const getEentryEditRoute = ({
  setToast,
  basename = "",
  path = EDIT_ENTRY_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Entry setToast={setToast} basename={basename} />} />
);

// Field Route
export const getFieldRoute = ({
  setToast,
  basename = "",
  path = EDIT_FIELD_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Edit setToast={setToast} basename={basename} />} />
);

export const getReactCmsRoutes = (props: ReactCmsRouteProps) => {
  const reactCmsRouteProps: ReactCmsRouteProps = {
    setToast: props.setToast,
    basename: props.basename || "",
  };
  return (
    <>
      {getHomeRoute({ ...reactCmsRouteProps })}
      {getNewModelRoute({ ...reactCmsRouteProps })}
      {getModelRoute({ ...reactCmsRouteProps })}
      {getModelIdRoute({ ...reactCmsRouteProps })}
      {getEditModelRoute({ ...reactCmsRouteProps })}
      {getEntryRoute({ ...reactCmsRouteProps })}
      {getEentryEditRoute({ ...reactCmsRouteProps })}
      {getFieldRoute({ ...reactCmsRouteProps })}
    </>
  );
}