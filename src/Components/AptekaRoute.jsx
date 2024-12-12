import { Route, Redirect, useHistory } from "react-router-dom";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { authFirebase } from "../Config/firebase";

function AptekRoute(props) {
  const { UserRoles = [] } = useSelector((state) => state.user || {});
  const history = useHistory();

  console.log(UserRoles, props.roleRoute, "CEK PENGAMANAN HALAMAN!!!!");

  if (!UserRoles || UserRoles.length === 0) {
    onAuthStateChanged(authFirebase, (user) => {
      if (!user) {
        history.push("/");
      }
    });
    return <Loading />;
  } else if (UserRoles.some((role) => props.roleRoute.includes(role))) {
    return <Route {...props} />;
  } else {
    return history.push("/");
  }
}

export default AptekRoute;
