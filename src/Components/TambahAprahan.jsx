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
import { useToast } from "@chakra-ui/react";
import { BsPlusCircle } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { BsFillFunnelFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";

function TambahAprahan() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [puskesmas, setPuskesmas] = useState([]);
  const history = useHistory();

  const daftarStatus = [
    {
      id: 1,
      namaStatus: "amprahan",
    },
    {
      id: 2,
      namaStatus: "Bon",
    },
    {
      id: 3,
      namaStatus: "Pengadaan",
    },
  ];
  function renderPuskesmas() {
    return puskesmas.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderStatus() {
    return daftarStatus.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.namaStatus}
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
      statusId: 0,
    },

    validationSchema: Yup.object().shape({
      puskesmasId: Yup.number("masukkan angka").required(
        "Perusahaan wajib diisi"
      ),
      statusId: Yup.number("masukkan angka").required("Status wajib diisi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      const { puskesmasId, statusId } = values;
      const tanggal = 1;
      console.log("aaaaaaaaaaaaaaa", puskesmasId, statusId);
      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/amprahan/post?puskesmasId=${puskesmasId}&statusId=${statusId}`
        )
        .then((res) => {
          toast({
            title: "Berhasil!",
            description: "Pengeluaran Obat Berhasil Dibuat",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          setTimeout(() => {
            history.push("/gfk/daftar-obat");
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
          <ModalHeader>Pengeluaran Obat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Pilih Status</FormLabel>
              <Select
                mt="10px"
                placeholder="Status"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("statusId", parseInt(e.target.value));
                }}
              >
                {renderStatus()}
              </Select>
              {formik.errors.statusId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.statusId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"30px"}>
              <FormLabel>Pilih Tujuan</FormLabel>
              <Select
                mt="10px"
                placeholder="Tujuan"
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Batal
            </Button> */}
            <Button px={"30px"} variant="primary" onClick={formik.handleSubmit}>
              Buat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TambahAprahan;
