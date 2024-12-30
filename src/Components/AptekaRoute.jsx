import { Route, Redirect, useHistory } from "react-router-dom";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { authFirebase } from "../Config/firebase";
import { useEffect } from "react";

function AptekRoute(props) {
  const { UserRoles = [] } = useSelector((state) => state.user || {});
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, (user) => {
      if (!user) {
        history.push("/");
      }
    });

    return () => unsubscribe();
  }, [history]);

  if (!UserRoles || UserRoles.length === 0) {
    return <Loading />;
  } else if (UserRoles.some((role) => props.roleRoute.includes(role))) {
    return <Route {...props} />;
  } else {
    history.push("/");
  }
}

export default AptekRoute;
