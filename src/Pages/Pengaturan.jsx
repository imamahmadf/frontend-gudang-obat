import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Container,
  Text,
  Image,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  HStack,
  Input,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Tooltip,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Alert,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import Layout from "../Components/Layout";

function Pengaturan() {
  const [userRole, setUserRole] = useState([]);
  async function fetchUserRole() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-role`)
      .then((res) => {
        setUserRole(res.data.result);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function renderUserRole() {
    return userRole.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  const formik = useFormik({
    initialValues: {
      nama: "",
    },

    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Mo. Batch wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { nama } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/uptd/perusahaan?nama=${nama}`
        )
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <Layout>
      <Box>
        <Container>
          <FormControl pb="20px">
            <FormLabel>Nama Perushaan</FormLabel>
            <Input
              mt={"10px"}
              type="text"
              placeholder="Nama Perusahaan"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                formik.setFieldValue("nama", e.target.value);
              }}
            />{" "}
            {formik.errors.nama ? (
              <Alert status="error" color="red" text="center">
                <i className="fa-solid fa-circle-exclamation"></i>
                <Text ms="10px">{formik.errors.nama}</Text>
              </Alert>
            ) : null}
          </FormControl>
          <Button onClick={formik.handleSubmit}>Apply</Button>

          <FormControl>
            <FormLabel>Pilih Kelas Terapi</FormLabel>
            <Select
              mt="10px"
              placeholder="Kelas Terapi"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                formik.setFieldValue("kelasTerapiId", parseInt(e.target.value));
              }}
            >
              {renderUserRole()}
            </Select>
            {formik.errors.kelasTerapiId ? (
              <Alert status="error" color="red" text="center">
                <i className="fa-solid fa-circle-exclamation"></i>
                <Text ms="10px">{formik.errors.kelasTerapiId}</Text>
              </Alert>
            ) : null}
          </FormControl>
        </Container>
      </Box>
    </Layout>
  );
}

export default Pengaturan;
