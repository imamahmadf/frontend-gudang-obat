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
  Alert,
  useBreakpointValue,
} from "@chakra-ui/react";
import FotoHome from "../assets/GFK.jpeg";
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
import imageLogin from "../assets/login.png";
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

  if (global.id) {
    history.push("/");
  }
  const handleWithGoogle = async () => {
    const providerGoogle = new GoogleAuthProvider();
    const credential = await signInWithPopup(authFirebase, providerGoogle);

    const user = credential.user;

    await axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user/get-by-id`, {
        params: { id: user.uid },
      })
      .then((res) => {
        history.push("/gfk/daftar-obat");
      })
      .catch((err) => {
        //console.log(err)
        alert("please registered your account in form register");
        history.push("/register");
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("your email is invalid")
        .email("input your email"),
      password: Yup.string().required("please fill in the password"),
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
          setWrongPass("Wrong Password");
        } else {
          alert(errorMessage);
        }
        //console.log(error);
      });
      //console.log(userCredential);
      const user = userCredential.user;

      // utk get data ke back-end dan di simpan di redux
      const response = axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/get-by-id`,
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

  return (
    <>
      <Box
        overflow="hidden"
        objectFit="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        height={"100vh"}
        w="100%"
      >
        <Container
          marginTop={"80px"}
          borderRadius={"20px"}
          p={"00px"}
          height={"1000px"}
          maxW={"1680px"}
          boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
        >
          <Flex flexDirection={flexDirection} wrap="wrap" height="100%">
            <Flex
              flexDirection={"column"}
              borderLeftRadius={"20px"}
              flex="1"
              p={"200px"}
              height={"100%"}
              alignItems="center"
              justifyContent="center"
            >
              <FormControl id="email" pb="12px">
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
              <FormControl id="password" pb="15px">
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
                      <i
                        className={
                          showPassword
                            ? "fa-sharp fa-solid fa-eye"
                            : "fa-solid fa-eye-slash"
                        }
                      />
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
                <Link to="/forgot-password">Forgot Password</Link>
              </Text>
              <Button variant="secondary" mt="20px" onClick={handleWithGoogle}>
                Login With Google
              </Button>
            </Flex>
            <Flex
              bgColor={"primary"}
              flexDirection={"column"}
              borderRightRadius={"20px"}
              flex="1"
              p={"200px"}
              height={"100%"}
            >
              <Image src={imageLogin} />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </>
  );
}

export default Login;
