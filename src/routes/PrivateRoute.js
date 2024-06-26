import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingAction from "../themes/LoadingAction/LoadingAction";
import * as links from "../utils/links";

function PrivateRoute({ children, ...rest }) {
  const { authInfo, loading } = useContext(AuthContext);
  const { isAuthenticated } = authInfo;

  if (loading) {
    return <LoadingAction />;
  }
  if (isAuthenticated) {
    return children;
  }
  return (
    <Navigate
      to={
        authInfo?.dataUser?.key === "ADMIN" ? links.SIGNIN : links.ADMIN_SIGNIN
      }
    />
  );
}

export default PrivateRoute;
