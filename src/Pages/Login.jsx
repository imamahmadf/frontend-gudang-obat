import React, { useState, useEffect } from "react";
import {
  Flex,
  Spacer,
  Image,
  Box,
  Heading,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  Text,
  Container,
  InputGroup,
  InputRightElement,
  Center,
  Alert,
  useBreakpointValue,
} from "@chakra-ui/react";
import Google from "../assets/google.png";
import LogoAPP from "../assets/logo app.png";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import Jafar from "../assets/gfk-depan.jpg";

import { authFirebase } from "../Config/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import auth_types from "../Redux/Reducers/Types/userTypes";
import { Link, useHistory } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Layout from "../Components/Layout";
import imageLogin from "../assets/BMHP.jpg";
import { onAuthStateChanged } from "firebase/auth";
function Login() {
  const global = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [wrongPass, setWrongPass] = useState("");
  // for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    setShowPassword(!showPassword);
  };
  // console.log(global);
  if (global.id) {
    history.push("/");
  }
  // const handleWithGoogle = async () => {
  //   const providerGoogle = new GoogleAuthProvider();
  //   try {
  //     const credential = await signInWithPopup(authFirebase, providerGoogle);
  //     const user = credential.user;

  //     await axios
  //       .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-by-id`, {
  //         params: { id: user.uid },
  //       })
  //       .then((res) => {
  //         history.push("/gfk/daftar-obat");
  //       })
  //       .catch((err) => {
  //         //console.log(err)
  //         alert("please registered your account in form register");
  //         history.push("/register");
  //       });
  //   } catch (error) {
  //     // Handle error
  //     alert("Error during Google sign-in: " + error.message);
  //   }
  // };
  const _handleRegister = async (credential, payload = {}) => {
    const user = credential.user;
    const providerId = credential.providerId
      ? credential.providerId
      : "password";
    if (!providerId.toLowerCase().includes("google")) {
      await sendEmailVerification(user);
    }

    const registerUrl = `${
      import.meta.env.VITE_REACT_APP_API_BASE_URL
    }/user/register`;
    payload =
      Object.keys(payload).length === 0
        ? {
            id: user.uid,
            name: user.displayName,
            email: user.email,

            firebaseProviderId: providerId,
          }
        : {
            id: user.uid,
            firebaseProviderId: providerId,
            ...payload,
          };

    const response = await axios.post(registerUrl, payload);
    // console.log(payload, "register");
    history.go("/gfk/daftar-obat");
  };

  const handleWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(authFirebase, provider);

    await _handleRegister(credential);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email Wajib diisi")
        .email("format email salah"),
      password: Yup.string().required("pasword wajid diisi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      //console.log(values);
      const { email, password } = values;

      const userCredential = await signInWithEmailAndPassword(
        authFirebase,
        email,
        password
      ).catch(function (error) {
        // handle error
        var errorCode = error.code;
        var errorMessage = error.errorMessage;
        if (errorCode === "auth/wrong-password") {
          setWrongPass("Password Salah");
        } else {
          alert(errorMessage);
        }
        //console.log(error);
      });
      //console.log(userCredential);
      const user = userCredential.user;

      // utk get data ke back-end dan di simpan di redux
      const response = axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-by-id`,
        {
          params: { id: user.uid },
        }
      );

      //console.log((await response).data);

      if ((await response).data.code !== 200) {
        alert("please register for your account");
      } else {
        if ((await response).data.result !== null) {
          history.push("/gfk/daftar-obat");
        } else {
          alert("your account is not user");
          authFirebase.signOut();
          history.push("/register");
        }
      }
    },
  });

  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        history.push("/");
      }
    });

    return () => unsubscribe();
  }, [history]);
  return (
    <>
      <Center backgroundColor={"primary"} height={"100vh"} w="100%">
        <Container
          borderRadius={"20px"}
          p={"00px"}
          height={"1000px"}
          maxW={"1680px"}
          bgColor={"white"}
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
        >
          <Flex wrap="wrap" height="100%">
            <Flex
              flexDirection={"column"}
              borderLeftRadius={"20px"}
              flex="1"
              p={{ ss: "0px", sl: "20px" }}
              height={"100%"}
              alignItems="center"
              justifyContent="center"
            >
              <Image
                mb={"50px"}
                width={{ ss: "70%", sl: "50%" }}
                src={LogoAPP}
              />
              <FormControl w={{ ss: "85%", sl: "60%" }} id="email" pb="12px">
                <Input
                  h={"50px"}
                  type="email"
                  placeholder="Email"
                  borderRadius="10px"
                  // onChange={(e) => inputHandler(e, "email")}
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value)
                  }
                />
                {formik.errors.email ? (
                  <Alert status="error" color="red" text="center">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <Text ms="10px">{formik.errors.email}</Text>
                  </Alert>
                ) : null}
              </FormControl>{" "}
              <FormControl w={{ ss: "85%", sl: "60%" }} id="password" pb="15px">
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    borderRadius="10px"
                    h={"50px"}
                    // onChange={(e) => inputHandler(e, "password")}
                    onChange={(e) =>
                      formik.setFieldValue("password", e.target.value)
                    }
                  />

                  <InputRightElement>
                    <Button onClick={handleClick} h={"50px"} mt={"10px"}>
                      {showPassword ? (
                        <BsEye style={{ fontSize: "30px" }} />
                      ) : (
                        <BsEyeSlash style={{ fontSize: "30px" }} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {formik.errors.password ? (
                  <Alert status="error" color="red" text="center">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <Text ms="10px">{formik.errors.password}</Text>
                  </Alert>
                ) : null}

                {wrongPass ? (
                  <Alert status="error" color="red" text="center">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <Text ms="10px">{wrongPass}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <Button
                variant="primary"
                mb="12px"
                // onClick={handleWithEmailPassword}
                onClick={formik.handleSubmit}
              >
                Login
              </Button>{" "}
              <Text
                fontSize="12px"
                fontWeight="300"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                <Link to="/lupa-password">Lupa Password</Link>
              </Text>
              <Button
                variant="secondary"
                mt="20px"
                onClick={handleWithGoogle}
                leftIcon={<Image height={"20px"} src={Google} mr="5px"></Image>}
              >
                Login With Google
              </Button>{" "}
              <Flex justifyContent="center" mt={"20px"}>
                <Text
                  fontSize="12px"
                  lineHeight="15.6px"
                  fontWeight="300"
                  textAlign="center"
                  mr="5px"
                >
                  Belum Punya Akun?
                </Text>
                <Text
                  fontSize="12px"
                  lineHeight="15.6px"
                  fontWeight="300"
                  textAlign="center"
                  _hover={{ textDecoration: "underline", fontWeight: "bold" }}
                  cursor="pointer"
                >
                  <Link to="register">Register</Link>
                </Text>
              </Flex>
            </Flex>
            <Flex
              bgColor={"primary"}
              flexDirection={"column"}
              borderRightRadius={"20px"}
              flex="1"
              height={"100%"}
              display={{ ss: "none", sl: "flex" }}
            >
              <Image
                height={"100%"}
                src={Jafar}
                borderRadius={"0 20px 20px 0"}
                overflow={"hiden"}
                objectFit={"cover"}
              />
            </Flex>
          </Flex>
        </Container>
      </Center>
    </>
  );
}

export default Login;
