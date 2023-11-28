import { Route } from "react-router-dom";
import { Home } from "../ReactCms/containers/Home";
import { Edit } from "../ReactCms/containers/Edit";
import { Model } from "../ReactCms/containers/Model";
import { Entry } from "../ReactCms/containers/Entry";
import React, { Dispatch } from "react";
import { ToastType } from "../ReactCms/components/Toaster";

export interface ReactCmsRouteProps {
  setToast?: Dispatch<React.SetStateAction<ToastType>>;
  basename?: string;
  path?: string;
}

export const BASENAME = "/react-cms";
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
    basename = BASENAME,
    path = HOME_URL,
  }: ReactCmsRouteProps
) => <Route path={basename + path} element={<Home setToast={setToast} basename={basename} />} />;

// Model Routes
export const getNewModelRoute = ({
  setToast,
  basename = BASENAME,
  path = NEW_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Home setToast={setToast} basename={basename} />} />;

export const getModelRoute = ({
  setToast,
  basename = BASENAME,
  path = MODEL_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Model setToast={setToast} basename={basename} />} />;

export const getModelIdRoute = ({
  setToast,
  basename = BASENAME,
  path = MODEL_ID_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Model setToast={setToast} basename={basename} />} />
);

export const getEditModelRoute = ({
  setToast,
  basename = BASENAME,
  path = EDIT_MODEL_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Edit setToast={setToast} basename={basename} />} />;

// Entry Routes
export const getEntryRoute = ({
  setToast,
  basename = BASENAME,
  path = ENTRY_URL,
}: ReactCmsRouteProps
) => <Route path={basename + path} element={<Entry setToast={setToast} basename={basename} />} />;

export const getEentryEditRoute = ({
  setToast,
  basename = BASENAME,
  path = EDIT_ENTRY_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Entry setToast={setToast} basename={basename} />} />
);

// Field Route
export const getFieldRoute = ({
  setToast,
  basename = BASENAME,
  path = EDIT_FIELD_URL,
}: ReactCmsRouteProps
) => (
  <Route path={basename + path} element={<Edit setToast={setToast} basename={basename} />} />
);

export const getReactCmsRoutes = (props: ReactCmsRouteProps) => {
  const reactCmsRouteProps: ReactCmsRouteProps = {
    setToast: props.setToast,
    basename: props.basename || BASENAME,
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