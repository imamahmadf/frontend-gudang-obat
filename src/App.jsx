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
import ObatUser from "./Pages/ObatUser";
import Laporan from "./Pages/Laporan";
import ErrorBoundary from "./Components/ErrorBoundary";
import AdminObat from "./Pages/AdminObat";
import LupaPassword from "./Pages/LupaPassword";
import Statistik from "./Pages/Statistik";
import Tentang from "./Pages/Tentang";
import NoBatchNol from "./Pages/NoBatchNol";
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
      <ErrorBoundary>
        <BrowserRouter>
          <Switch>
            <AptekaRoute
              component={DaftarObatAlkes}
              path="/gfk/daftar-obat"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={TambahObat}
              path="/gfk/tambah-obat"
              exact
              roleRoute={[3, 4, 7, 8]}
            />
            <AptekaRoute
              component={TambahObatBaru}
              path="/gfk/tambah-obat-baru"
              exact
              roleRoute={[4, 7, 8]}
            />
            <AptekaRoute
              component={EditObat}
              path="/gfk/edit-obat/:obatId"
              roleRoute={[3, 7, 8]}
            />
            <AptekaRoute
              component={DetailObat}
              path="/gfk/detail-obat/:obatId"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={DetailAlokasi}
              path="/gfk/detail-alokasi/:alokasiId"
              exact
              roleRoute={[2, 7, 8]}
            />
            <AptekaRoute
              component={Puskesmas}
              path="/gfk/puskesmas"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={PuskesmasDetail}
              path="/gfk/puskesmas-detail/:id"
              exact
              roleRoute={[1, 8]}
            />{" "}
            <AptekaRoute
              component={Statistik}
              path="/gfk/statistik"
              exact
              roleRoute={[1, 8]}
            />{" "}
            <AptekaRoute
              component={Amprahan}
              path="/gfk/amprahan"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={ObatRusak}
              path="/gfk/obat-rusak"
              exact
              roleRoute={[2, 6, 7, 8]}
            />
            <AptekaRoute
              component={DetailAmprahan}
              path="/gfk/amprahan/:amprahanId"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={AlokasiItem}
              path="/gfk/alokasi-item/:obatId"
              exact
              roleRoute={[7, 8]}
            />
            <AptekaRoute
              component={PenanggungJawabObat}
              path="/gfk/pengaturan/penanggung-jawab-obat"
              exact
              roleRoute={[7, 8]}
            />{" "}
            <AptekaRoute
              component={AdminObat}
              path="/gfk/admin-obat/:obatId"
              exact
              roleRoute={[8]}
            />
            <AptekaRoute
              component={ObatMasuk}
              path="/gfk/obat-masuk"
              exact
              roleRoute={[5, 7, 8]}
            />
            {/* <AptekaRoute
            component={Pengaturan}
            path="/gfk/pengaturan"
            roleRoute={[7, 8]}
            exact
          /> */}
            <AptekaRoute
              component={Pengaturan}
              path="/gfk/pengaturan"
              exact
              roleRoute={[7, 8]}
            />
            <AptekaRoute
              component={Profile}
              path="/gfk/profile"
              exact
              roleRoute={[1, 2, 3, 4, 5, 6, 7, 8]}
            />
            <AptekaRoute
              component={Kadaluwarsa}
              path="/gfk/kadaluwarsa"
              exact
              roleRoute={[1, 2, 6, 7, 8]}
            />
            <AptekaRoute
              component={StokOpname}
              path="/gfk/stok-opname"
              exact
              roleRoute={[7, 8]}
            />
            <AptekaRoute
              component={ObatUser}
              path="/gfk/obat-user/:profileId"
              exact
              roleRoute={[3, 7, 8]}
            />
            <AptekaRoute
              component={Alokasi}
              path="/gfk/alokasi"
              exact
              roleRoute={[2, 7, 8]}
            />{" "}
            <AptekaRoute
              component={Laporan}
              path="/gfk/laporan"
              exact
              roleRoute={[2, 7, 8]}
            />
            <Route
              component={DaftarAlokasi}
              path="/gfk/daftar-alokasi"
              exact
              roleRoute={[2, 7, 8]}
            />
            <Route
              component={PengaturanUser}
              path="/gfk/pengaturan/user"
              exact
              roleRoute={[7, 8]}
            />
            <Route
              component={NoBatchNol}
              path="/gfk/nomor-batch-nol"
              exact
              roleRoute={[7, 8]}
            />
            <Route
              component={DaftarKadaluwarsa}
              path="/gfk/daftar-kadaluwarsa"
              exact
              roleRoute={[1, 2, 6, 7, 8]}
            />
            <Route component={Login} path="/login" exact />{" "}
            <Route component={Tentang} path="/tentang" exact />
            <Route component={Register} path="/register" exact />
            <Route component={LupaPassword} path="/lupa-password" exact />
            <Route component={Home} path="/" />
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
