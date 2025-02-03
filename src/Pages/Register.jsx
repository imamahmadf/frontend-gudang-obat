import React from "react";

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
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  FormHelperText,
  Center,
  Container,
  useBreakpointValue,
} from "@chakra-ui/react";
import imageLogin from "../assets/BMHP.jpg";
import LogoAPP from "../assets/logo app.png";
import Google from "../assets/google.png";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import "yup-phone";
import { authFirebase } from "../Config/firebase";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

function RegisterUser() {
  const global = useSelector((state) => state.user);
  let history = useHistory();

  if (global.id) history.push("/");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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

  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",

      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("your email is invalid")
        .email("format yang dimasukan bukan email"),

      password: Yup.string()
        .required("please fill in the password")
        .min(8)
        .minUppercase(1)
        .minNumbers(1),
      confirmPassword: Yup.string()
        .required("please re-type your password")
        .oneOf([Yup.ref("password"), null], "Didn't match with password"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const { name, email, password } = values;
      const credential = await createUserWithEmailAndPassword(
        authFirebase,
        email,
        password
      );

      await _handleRegister(credential, {
        name: name,
        email: email,
      });
    },
  });
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });
  return (
    <Center backgroundColor={"primary"} height={"100vh"} w="100%">
      <Container
        borderRadius={"20px"}
        height={"1000px"}
        maxW={"1680px"}
        bgColor={"white"}
        boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
        p={0}
      >
        {" "}
        <Flex
          flexDirection={flexDirection}
          wrap="wrap"
          height="100%"
          p={0}
          margin={0}
        >
          <Flex
            flexDirection={"column"}
            borderLeftRadius={"20px"}
            flex="1"
            p={"20px"}
            height={"100%"}
            alignItems="center"
            justifyContent="center"
          >
            <Image src={LogoAPP} alt="APTEKA" width="50%" />
            <Heading as="h1" size="md" m="10px">
              Join APTEKA
            </Heading>
            <Flex justifyContent="center" mb={"20px"}>
              <Text
                fontSize="12px"
                lineHeight="15.6px"
                fontWeight="300"
                textAlign="center"
                mr="5px"
              >
                Sudah Punya Akun?
              </Text>
              <Text
                fontSize="12px"
                lineHeight="15.6px"
                fontWeight="300"
                textAlign="center"
                _hover={{ textDecoration: "underline", fontWeight: "bold" }}
                cursor="pointer"
              >
                <Link to="login">Login</Link>
              </Text>
            </Flex>

            <FormControl w={{ ss: "85%", sl: "60%" }} id="name" pb="12px">
              <Input
                h={"50px"}
                type="text"
                placeholder="Name"
                borderRadius="10px"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
              />
              {formik.errors.name ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.name}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl w={{ ss: "85%", sl: "60%" }} id="email" pb="12px">
              <Input
                h={"50px"}
                type="email"
                placeholder="Email"
                borderRadius="10px"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
              />
              {formik.errors.email ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.email}</Text>
                </Alert>
              ) : null}
            </FormControl>

            <FormControl w={{ ss: "85%", sl: "60%" }} id="password" pb="12px">
              <InputGroup>
                <Input
                  h={"50px"}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  borderRadius="10px"
                  onChange={(e) =>
                    formik.setFieldValue("password", e.target.value)
                  }
                />
                <InputRightElement>
                  <Button
                    h={"50px"}
                    mt={"10px"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
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
            </FormControl>
            <FormControl
              w={{ ss: "85%", sl: "60%" }}
              id="confirmPassword"
              pb="12px"
            >
              <InputGroup>
                <Input
                  h={"50px"}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  borderRadius="10px"
                  onChange={(e) =>
                    formik.setFieldValue("confirmPassword", e.target.value)
                  }
                />
                <InputRightElement>
                  <Button
                    h={"50px"}
                    mt={"10px"}
                    onClick={(e) =>
                      setShowConfirmPassword((current) => !current)
                    }
                  >
                    {showPassword ? (
                      <BsEye style={{ fontSize: "30px" }} />
                    ) : (
                      <BsEyeSlash style={{ fontSize: "30px" }} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.errors.confirmPassword ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.confirmPassword}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <Button variant="primary" mb="12px" onClick={formik.handleSubmit}>
              Sign up
            </Button>

            <Button
              variant="secondary"
              mt="20px"
              onClick={handleWithGoogle}
              leftIcon={<Image height={"20px"} src={Google} mr="5px"></Image>}
            >
              Login With Google
            </Button>
          </Flex>{" "}
          <Flex
            bgColor={"primary"}
            flexDirection={"column"}
            borderRightRadius={"20px"}
            flex="1"
            height={"100%"}
            display={{ ss: "none", sl: "flex" }}
          >
            <Image
              width={"100%"}
              height={"100%"}
              src={imageLogin}
              borderRadius={"0 20px 20px 0"}
            />
          </Flex>
        </Flex>
      </Container>
    </Center>
  );
}

export default RegisterUser;
