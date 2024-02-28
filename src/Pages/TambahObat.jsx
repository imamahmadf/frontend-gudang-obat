import React, { useEffect, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Box,
  Text,
  Button,
  InputLeftAddon,
  InputGroup,
  Select,
  Input,
  Alert,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Components/Layout";

import { BsFillFunnelFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
function tambahObat() {
  const [namaObat, setNamaObat] = useState([]);

  const [selectedObat, setSelectedObat] = useState(0);
  const [perusahaanId, setPerusahaanId] = useState([]);
  const history = useHistory();

  function renderPerusahaan() {
    return perusahaanId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  async function fetchNamaPerusahaan() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/perusahaan`)
      .then((res) => {
        console.log(res.data, "perusahaan");
        setPerusahaanId(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  async function fetchNamaObat() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/get-nama`)
      .then((res) => {
        console.log(res.data, "tessss");
        setNamaObat(res.data);
      })
      .catch((err) => {
        console.error(err.Message);
      });
  }

  YupPassword(Yup);
  //formik initialization
  const formik = useFormik({
    initialValues: {
      noBatch: "",
      exp: "",
      harga: "",
      stok: "",
      perushaaan: 0,
    },
    // onSubmit: (values) => {
    //   alert(JSON.stringify(values, null, 2));
    // },
    validationSchema: Yup.object().shape({
      noBatch: Yup.string().required("Mo. Batch wajib diisi"),
      exp: Yup.string().required("tanganggal kadaluarsa wajib diisi"),
      harga: Yup.number("masukkan angka").required("harga satuan wajib disi"),
      perusahaan: Yup.number("masukkan angka").required(
        "Perusahaan wajib diisi"
      ),
      stok: Yup.number("masukkan angka").required("stok obat wajib disi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values, "tes formik");
      const { noBatch, exp, harga, stok, perusahaan } = values;
      console.log(selectedObat);
      // kirim data ke back-end
      history.push("/daftar-obat");
      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/no-batch/post?noBatch2=${noBatch}&harga=${harga}&exp=${exp}&obatId=${
            selectedObat.value
          }&stok=${stok}&perusahaanId=${perusahaan}`
        )
        .then((res) => {
          // alert(res.data.message);

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
    fetchNamaObat();
    fetchNamaPerusahaan();
  }, []);

  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
            <FormControl>
              <FormLabel>Pilih Nama Obat</FormLabel>
              <Select2
                options={namaObat.result?.map((val) => {
                  return { value: val.id, label: val.nama };
                })}
                onChange={(choice) => {
                  setSelectedObat(choice);
                }}
                value={selectedObat}
                placeholder="Cari Nama Obat"
                closeMenuOnSelect={false}
              />
            </FormControl>
            <Button
              leftIcon={<BsFillFunnelFill />}
              color="rgba(175, 175, 175, 1)"
              aria-label="toggle filters"
              variant="solid"
              backgroundColor="white"
              border="1px"
              borderRadius={"8px"}
              onClick={() => {
                history.push("/gfk/tambah-obat-baru");
              }}
            >
              Tambah Obat Baru
            </Button>
          </Container>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            display={selectedObat ? "block" : "none"}
            p={"30px"}
          >
            <FormControl pb="20px">
              <FormLabel>No. Batch</FormLabel>
              <Input
                mt={"10px"}
                type="text"
                placeholder="No. Batch"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("noBatch", e.target.value);
                }}
              />
              {formik.errors.noBatch ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.noBatch}</Text>
                </Alert>
              ) : null}
            </FormControl>

            <FormControl pb="20px">
              <FormLabel>EXP</FormLabel>
              <Input
                mt={"10px"}
                placeholder="EXP"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                type="date"
                onChange={(e) => {
                  formik.setFieldValue("exp", e.target.value);
                }}
              />
              {formik.errors.exp ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.exp}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Harga</FormLabel>
              <InputGroup>
                <InputLeftAddon>Rp.</InputLeftAddon>
                <Input
                  type="number"
                  placeholder="Harga"
                  mt={"10px"}
                  border="1px"
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  onChange={(e) => {
                    formik.setFieldValue("harga", e.target.value);
                  }}
                />
                {formik.errors.harga ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.harga}</Text>
                  </Alert>
                ) : null}
              </InputGroup>
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Stok</FormLabel>
              <Input
                mt={"10px"}
                type="number"
                placeholder="stok"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("stok", e.target.value);
                }}
              />
              {formik.errors.stok ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.stok}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl>
              <FormLabel>Perusahaan</FormLabel>
              <Select
                mt="10px"
                placeholder="Perushaan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("perusahaan", parseInt(e.target.value));
                }}
              >
                {renderPerusahaan()}
              </Select>
              {formik.errors.perusahaanId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.perusahaanId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <Button w="100%" mb="40px" onClick={formik.handleSubmit}>
              Save
            </Button>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default tambahObat;
