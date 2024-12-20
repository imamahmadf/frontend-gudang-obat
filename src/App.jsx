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
import Alokasi from "./Pages/Alokasi";
import AlokasiItem from "./Pages/AlokasiItem";
import DaftarAlokasi from "./Pages/DaftarAlokasi";
import DetailAlokasi from "./Pages/DetailAlokasi";
import PengaturanUser from "./Pages/PengaturanUser";
import AptekaRoute from "./Components/AptekaRoute";
import ObatRusak from "./Pages/ObatRusak";
import PenanggungJawabObat from "./Pages/PenanggungJawabObat";
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
          <AptekaRoute
            component={DaftarObatAlkes}
            path="/gfk/daftar-obat"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={TambahObat}
            path="/gfk/tambah-obat"
            exact
            roleRoute={[3, 4, 8]}
          />
          <AptekaRoute
            component={TambahObatBaru}
            path="/gfk/tambah-obat-baru"
            exact
            roleRoute={[4, 8]}
          />
          <AptekaRoute
            component={EditObat}
            path="/gfk/edit-obat/:obatId"
            roleRoute={[3, 8]}
          />
          <AptekaRoute
            component={DetailObat}
            path="/gfk/detail-obat/:obatId"
            exact
            roleRoute={[1, 3, 8]}
          />
          <AptekaRoute
            component={DetailAlokasi}
            path="/gfk/detail-alokasi/:alokasiId"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={Puskesmas}
            path="/gfk/puskesmas"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={PuskesmasDetail}
            path="/gfk/puskesmas-detail/:id"
            exact
            roleRoute={[1, 8]}
          />{" "}
          <AptekaRoute
            component={Amprahan}
            path="/gfk/amprahan"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={ObatRusak}
            path="/gfk/obat-rusak"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={DetailAmprahan}
            path="/gfk/amprahan/:amprahanId"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={AlokasiItem}
            path="/gfk/alokasi-item/:obatId"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={PenanggungJawabObat}
            path="/gfk/pengaturan/penanggung-jawab-obat"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={ObatMasuk}
            path="/gfk/obat-masuk"
            exact
            roleRoute={[5, 8]}
          />
          {/* <AptekaRoute
            component={Pengaturan}
            path="/gfk/pengaturan"
            roleRoute={[7, 8]}
            exact
          /> */}
          <Route component={Pengaturan} path="/gfk/pengaturan" exact />
          <AptekaRoute
            component={Profile}
            path="/gfk/profile"
            exact
            roleRoute={[1, 8]}
          />
          <AptekaRoute
            component={Kadaluwarsa}
            path="/gfk/kadaluwarsa"
            exact
            roleRoute={[6, 8]}
          />
          <AptekaRoute
            component={StokOpname}
            path="/gfk/stok-opname"
            exact
            roleRoute={[6, 8]}
          />
          <Route
            component={Alokasi}
            path="/gfk/alokasi"
            exact
            roleRoute={[7, 8]}
          />
          <Route
            component={DaftarAlokasi}
            path="/gfk/daftar-alokasi"
            exact
            roleRoute={[1, 8]}
          />
          <Route
            component={PengaturanUser}
            path="/gfk/pengaturan/user"
            exact
            roleRoute={[7, 8]}
          />
          <Route
            component={DaftarKadaluwarsa}
            path="/gfk/daftar-kadaluwarsa"
            exact
            roleRoute={[1, 8]}
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
