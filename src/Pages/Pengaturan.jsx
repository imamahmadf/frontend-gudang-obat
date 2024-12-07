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
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import Layout from "../Components/Layout";

function Pengaturan() {
  const [userRole, setUserRole] = useState([]);
  const [seed, setSeed] = useState([]);
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

  async function getDataSeeed() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pengaturan/get/seeders`
      )
      .then((res) => {
        setSeed(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const formikTujuan = useFormik({
    initialValues: {
      namaTujuan: "",
    },

    validationSchema: Yup.object().shape({
      namaTujuan: Yup.string().required("Tujuan wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { namaTujuan } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/Tujuan?nama=${namaTujuan}`
        )
        .then((res) => {
          getDataSeeed();
          formikTujuan.resetForm();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  const formikKategori = useFormik({
    initialValues: {
      namaKategori: "",
    },

    validationSchema: Yup.object().shape({
      namaKategori: Yup.string().required("Kategori wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { namaKategori } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/kategori?nama=${namaKategori}`
        )
        .then((res) => {
          getDataSeeed();
          formikKategori.resetForm();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  const formikKelasTerapi = useFormik({
    initialValues: {
      namaKelasTerapi: "",
    },

    validationSchema: Yup.object().shape({
      namaKelasTerapi: Yup.string().required("Kelas Terapixx wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { namaKelasTerapi } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/kelas-terapi?nama=${namaKelasTerapi}`
        )
        .then((res) => {
          getDataSeeed();
          formikKelasTerapi.resetForm();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  const formikSumberDana = useFormik({
    initialValues: {
      namaSumberDana: "",
    },

    validationSchema: Yup.object().shape({
      namaSumberDana: Yup.string().required("Kelas Terapixx wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { namaSumberDana } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/sumber-dana?sumber=${namaSumberDana}`
        )
        .then((res) => {
          getDataSeeed();
          formikSumberDana.resetForm();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  const formikSatuan = useFormik({
    initialValues: {
      namaSatuan: "",
    },

    validationSchema: Yup.object().shape({
      namaSatuan: Yup.string().required("Satuan wajib diisi"),
    }),

    validateOnChange: false,

    onSubmit: async (values) => {
      const { namaSatuan } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/satuan?nama=${namaSatuan}`
        )
        .then((res) => {
          getDataSeeed();
          formikSatuan.resetForm();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

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
          getDataSeeed();
        })
        .catch((err) => {
          console.error(err.Message);
        });
    },
  });

  useEffect(() => {
    fetchUserRole();
    getDataSeeed();
  }, []);

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          marginBottom={"20px"}
          padding={"20px"}
        >
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Satuan</Tab>
              <Tab>Kelas terapi</Tab>
              <Tab>Kategori</Tab>
              <Tab>Tujuan Obat</Tab>
              <Tab>Asal Obat</Tab>
              <Tab>Sumber Dana</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>No.</Th>
                          <Th>Nama</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.satuanSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td>{idx + 1}</Td>
                            <Td>{item.nama}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  <Box w={"50%"} ms={"10px"}>
                    <FormControl pb="20px">
                      <FormLabel>Satuan</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Satuan"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikSatuan.values.namaSatuan}
                        onChange={(e) => {
                          formikSatuan.setFieldValue(
                            "namaSatuan",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikSatuan.errors.namaSatuan ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikSatuan.errors.namaSatuan}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button onClick={formikSatuan.handleSubmit}>Apply</Button>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    {" "}
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Nama</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.kelasterapiSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.nama}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                  <Box w={"50%"} ms={"10px"}>
                    {" "}
                    <FormControl pb="20px">
                      <FormLabel>Kelas Terapi</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Kelas terapi"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikKelasTerapi.values.namaKelasTerapi}
                        onChange={(e) => {
                          formikKelasTerapi.setFieldValue(
                            "namaKelasTerapi",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikKelasTerapi.errors.namaKelasTerapi ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikKelasTerapi.errors.namaKelasTerapi}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button onClick={formikKelasTerapi.handleSubmit}>
                      Apply
                    </Button>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    {" "}
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Nama</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.kategoriSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.nama}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                  <Box w={"50%"} ms={"10px"}>
                    {" "}
                    <FormControl pb="20px">
                      <FormLabel>Kategori</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Kategori"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikKelasTerapi.values.namaKelasTerapi}
                        onChange={(e) => {
                          formikKategori.setFieldValue(
                            "namaKategori",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikKategori.errors.namaKategori ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikKategori.errors.namaKategori}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button onClick={formikKategori.handleSubmit}>Apply</Button>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Nama</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.uptdSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.nama}</Td>
                            <Td>{item.status}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                  <Box w={"50%"} ms={"10px"}>
                    <FormControl pb="20px">
                      <FormLabel>Tujuan Obat</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Tujuan"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikSatuan.values.namaSatuan}
                        onChange={(e) => {
                          formikTujuan.setFieldValue(
                            "namaTujuan",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikTujuan.errors.namaTujuan ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikTujuan.errors.namaTujuan}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button onClick={formikTujuan.handleSubmit}>Apply</Button>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    {" "}
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Nama</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.perusahaanSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.nama}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                  <Box w={"50%"} ms={"10px"}>
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
                  </Box>
                </Flex>
              </TabPanel>

              <TabPanel>
                <Flex>
                  <Box w={"50%"} me={"10px"}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Sumber</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.sumberDanaSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td>{item.id}</Td>
                            <Td>{item.sumber}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                  <Box w={"50%"} ms={"10px"}>
                    <FormControl pb="20px">
                      <FormLabel>Tambah Sumber Dana</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Sumber Dana"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikSatuan.values.namaSatuan}
                        onChange={(e) => {
                          formikSumberDana.setFieldValue(
                            "namaSumberDana",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikSumberDana.errors.namaSumberDana ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikSumberDana.errors.namaSumberDana}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button onClick={formikSumberDana.handleSubmit}>
                      Apply
                    </Button>
                  </Box>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Layout>
  );
}

export default Pengaturan;
