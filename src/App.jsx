import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import DaftarObatAlkes from "./Pages/DaftarObat";
import TambahObat from "./Pages/TambahObat";
import TambahObatBaru from "./Pages/TambahObatBaru";
import EditObat from "./Pages/EditObat";
import DetailObat from "./Pages/DetailObat";
import Puskesmas from "./Pages/Puskesmas";
import PuskesmasDetail from "./Pages/PuskesmasDetail";
import Amprahan from "./Pages/Amprahan";
import DetailAmprahan from "./Pages/DetailAmprahan";
import Pengaturan from "./Pages/Pengaturan";
import Register from "./Pages/Register";
import axios from "axios";
import Loading from "./Components/Loading";
import { useDispatch, useSelector } from "react-redux";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import { authFirebase } from "./Config/firebase";
import ObatMasuk from "./Pages/ObatMasuk";
import Login from "./Pages/Login";
import auth_types from "./Redux/Reducers/Types/userTypes";
import Kadaluwarsa from "./Pages/Kadaluwarsa";
import StokOpname from "./Pages/StokOpname";
import DaftarKadaluwarsa from "./Pages/DaftarKadaluwarsa";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
function App() {
  const [emailVerified, setEmailVerified] = useState("");
  const [userLogin, setUserLogin] = useState({});
  const [firebaseProvider, setFirebaseProvider] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id, email, UserRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // untuk dpt info user auth
    const auth = getAuth();
    //pengecekan user ada yg login atau tidak

    onAuthStateChanged(auth, (user) => {
      console.log(user, "APP.JSX");
      if (user) {
        setUserLogin(user);
        setUserId(user.uid);
        setFirebaseProvider(user.providerData[0].providerId);
        setEmailVerified(user.emailVerified);
        console.log("ada yg login");
        // kondisi jika sudah terverifikasi
        if (user.emailVerified) {
          console.log("your account has been verified");
        } else {
          console.log("Your account has not been verified");
        }
      } else {
        console.log("tidak ada yg login");
        // jika tidak ada akan di logout
        auth.signOut();
      }
    });
    //get data dan dimasukan ke redux
    // utk get data ke back-end dan di simpan di redux
    const getDataGlobal = () => {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/redux-user`, {
          params: {
            id: userId,
          },
        })
        .then((res) => {
          console.log(res.data, "CEK APPPP JAAA");
          if (res.data.globalState === !null) {
            //console.log("loading...");
          } else {
            res.data.globalState.UserRoles = res.data.globalState.userRoles.map(
              (val) => {
                console.log(val);
                return val.roleId;
              }
            );
            // if (res.data.globalState.Tenant === null) {
            //   res.data.globalState.Tenant = 0;
            // }
            // if (res.data.globalState.Profile === null) {
            //   res.data.globalState.Profile = 0;
            // }
            // console.log("data get2 :", res.data.globalState);
            dispatch({
              type: auth_types.Redux,
              payload: {
                id: res.data.globalState?.id,
                email: res.data.globalState?.email,
                emailVerified,
                firebaseProviderId: res.data.globalState?.firebaseProviderId,
                UserRoles: res.data.globalState?.UserRoles,
                profileId: res.data.globalState?.profile?.id,
                // TenantId: res.data.globalState.Tenant.id || 0,
                // TenantName: res.data.globalState?.Tenant?.name,
                ProfileName: res.data.globalState?.profile?.nama,
                ProfilePic: res.data.globalState?.profile?.profilePic,
              },
            });
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoading(false);
        });
    };
    getDataGlobal();
  }, [userId]);
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <BrowserRouter>
        <Switch>
          <Route component={DaftarObatAlkes} path="/gfk/daftar-obat" exact />
          <Route component={TambahObat} path="/gfk/tambah-obat" exact />
          <Route
            component={TambahObatBaru}
            path="/gfk/tambah-obat-baru"
            exact
          />
          <Route component={EditObat} path="/edit-obat/:obatId" />
          <Route component={DetailObat} path="/gfk/detail-obat/:obatId" exact />
          <Route component={Puskesmas} path="/gfk/puskesmas" exact />
          <Route
            component={PuskesmasDetail}
            path="/gfk/puskesmas-detail/:id"
            exact
          />{" "}
          <Route component={Amprahan} path="/gfk/amprahan" exact />
          <Route
            component={DetailAmprahan}
            path="/gfk/amprahan/:amprahanId"
            exact
          />
          <Route component={ObatMasuk} path="/gfk/obat-masuk" exact />
          <Route component={Pengaturan} path="/gfk/pengaturan" exact />
          <Route component={Profile} path="/gfk/profile" exact />
          <Route component={Kadaluwarsa} path="/gfk/kadaluwarsa" exact />
          <Route component={StokOpname} path="/gfk/stok-opname" exact />
          <Route
            component={DaftarKadaluwarsa}
            path="/gfk/daftar-kadaluwarsa"
            exact
          />
          <Route component={Login} path="/login" exact />
          <Route component={Register} path="/register" exact />
          <Route component={Home} path="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
