import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Text,
  Button,
  Alert,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { BsPlusCircle } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { BsFillFunnelFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

function TambahAprahan() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [puskesmas, setPuskesmas] = useState([]);
  const history = useHistory();

  function renderPuskesmas() {
    return puskesmas.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  async function fetchDataPuskesmas() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas`)
      .then((res) => {
        setPuskesmas(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  YupPassword(Yup);
  const formik = useFormik({
    initialValues: {
      puskesmasId: 0,
      tanggal: "",
    },

    validationSchema: Yup.object().shape({
      puskesmasId: Yup.number("masukkan angka").required(
        "Perusahaan wajib diisi"
      ),
      tanggal: Yup.string().required("tanganggal amprahan wijid diisi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const { puskesmasId, tanggal } = values;
      // console.log("aaaaaaaaaaaaaaa", puskesmasId);
      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/amprahan/post?puskesmasId=${puskesmasId}&tanggal=${tanggal}`
        )
        .then((res) => {
          alert(res.data.message);
          setTimeout(() => {
            history.push("/daftar-obat");
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });
  useEffect(() => {
    fetchDataPuskesmas();
  }, []);
  return (
    <Box>
      <Button
        leftIcon={<BsPlusCircle />}
        color="rgba(175, 175, 175, 1)"
        aria-label="toggle filters"
        variant="solid"
        backgroundColor="white"
        border="1px"
        borderRadius={"8px"}
        onClick={onOpen}
      >
        Buat Amprahan
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            aaaaaa
            <FormControl>
              <FormLabel>Pilih Kelas Terapi</FormLabel>
              <Select
                mt="10px"
                placeholder="Kelas Terapi"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("puskesmasId", parseInt(e.target.value));
                }}
              >
                {renderPuskesmas()}
              </Select>
              {formik.errors.puskesmasId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.puskesmasId}</Text>
                </Alert>
              ) : null}
            </FormControl>{" "}
            <FormControl pb="20px">
              <FormLabel>Tanggal</FormLabel>
              <Input
                mt={"10px"}
                placeholder="EXP"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                type="date"
                onChange={(e) => {
                  formik.setFieldValue("tanggal", e.target.value);
                }}
              />
              {formik.errors.tanggal ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.tanggal}</Text>
                </Alert>
              ) : null}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={formik.handleSubmit}>
              Secondary Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TambahAprahan;
