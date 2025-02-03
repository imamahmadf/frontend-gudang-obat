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
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import YupPassword from "yup-password";
import Layout from "../Components/Layout";
import Batik from "../assets/BATIK.png";

function Pengaturan() {
  const history = useHistory();
  const [userRole, setUserRole] = useState([]);
  const [seed, setSeed] = useState([]);
  async function fetchUserRole() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-role`)
      .then((res) => {
        setUserRole(res.data.result);
        // console.log(res.data);
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
        // console.log(res.data);
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

  const formikAplikasi = useFormik({
    initialValues: {
      namaAplikasi: "",
      warnaAplikasi: "",
    },

    validationSchema: Yup.object().shape({
      namaAplikasi: Yup.string().required("nama Aplikasi wajib diisi"),
      warnaAplikasi: Yup.string().required("Warna wajib diisi"),
    }),

    validateOnChange: true,

    onSubmit: async (values) => {
      // console.log("Submitted values:", values);
      const { namaAplikasi, warnaAplikasi } = values;

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/pengaturan/post/aplikasi`,
          { nama: namaAplikasi, warna: warnaAplikasi }
        )
        .then((res) => {
          getDataSeeed();
          formikAplikasi.resetForm();
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
      <Box
        backgroundImage={`url(${Batik})`}
        pt={"80px"}
        bgColor={"rgba(249, 250, 251, 1)"}
      >
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          marginBottom={"20px"}
          padding={"20px"}
        >
          <Flex gap={4} mb={"20px"}>
            <Button
              onClick={() => {
                history.push("/gfk/pengaturan/penanggung-jawab-obat");
              }}
              variant={"secondary"}
            >
              Penanggung jawab
            </Button>
            <Button
              onClick={() => {
                history.push("/gfk/pengaturan/user");
              }}
              variant={"secondary"}
            >
              User Role
            </Button>
          </Flex>
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em" style={{ overflowX: "auto" }}>
              <Tab>Satuan</Tab>
              <Tab>Kelas terapi</Tab>
              <Tab>Kategori</Tab>
              <Tab>Tujuan Obat</Tab>
              <Tab>Asal Obat</Tab>
              <Tab>Aplikasi</Tab>
              <Tab>Sumber Dana</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box>
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
                    <Button
                      onClick={formikSatuan.handleSubmit}
                      variant={"primary"}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.satuanSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
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
                    <Button
                      variant={"primary"}
                      onClick={formikKelasTerapi.handleSubmit}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box me={"10px"}>
                    {" "}
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.kelasterapiSeed?.map((item) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.id}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
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
                    <Button
                      onClick={formikKategori.handleSubmit}
                      variant={"primary"}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    {" "}
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.kategoriSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
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
                    <Button
                      onClick={formikTujuan.handleSubmit}
                      variant={"primary"}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.uptdSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
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
                    <Button onClick={formik.handleSubmit} variant={"primary"}>
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.perusahaanSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </SimpleGrid>
              </TabPanel>
              {/* //////// */}
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
                    <FormControl pb="20px">
                      <FormLabel>Tambah Aplikasi</FormLabel>
                      <Input
                        mt={"10px"}
                        type="text"
                        placeholder="Aplikasi"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        // value={formikSatuan.values.namaSatuan}
                        onChange={(e) => {
                          formikAplikasi.setFieldValue(
                            "namaAplikasi",
                            e.target.value
                          );
                        }}
                      />{" "}
                      {formikAplikasi.errors.namaAplikasi ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikAplikasi.errors.namaAplikasi}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>{" "}
                    <FormControl pb="20px">
                      <FormLabel>Warna</FormLabel>
                      <Input
                        mt={"10px"}
                        type="color"
                        placeholder="Aplikasi"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        value={formikAplikasi.values.warnaAplikasi}
                        onChange={(e) => {
                          formikAplikasi.setFieldValue(
                            "warnaAplikasi",
                            e.target.value.toString()
                          );
                          // console.log(e.target.value.toString());
                        }}
                      />{" "}
                      {formikAplikasi.errors.warnaAplikasi ? (
                        <Alert status="error" color="red" text="center">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          <Text ms="10px">
                            {formikAplikasi.errors.warnaAplikasi}
                          </Text>
                        </Alert>
                      ) : null}
                    </FormControl>
                    <Button
                      onClick={formikAplikasi.handleSubmit}
                      variant={"primary"}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Nama Aplikasi
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.aplikasiSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                              bgColor={item.warna}
                            >
                              {item.nama}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>{" "}
                </SimpleGrid>
              </TabPanel>{" "}
              {/* //////// */}
              <TabPanel>
                <SimpleGrid columns={2} minChildWidth="200px" gap={3}>
                  <Box mb={"20px"}>
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
                    <Button
                      variant={"primary"}
                      onClick={formikSumberDana.handleSubmit}
                    >
                      Apply
                    </Button>
                  </Box>
                  <Box>
                    <Table variant="simple">
                      <Thead bgColor={"primary"}>
                        <Tr>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            No.
                          </Th>
                          <Th
                            borderWidth="1px"
                            borderColor="white"
                            rowSpan={2}
                            fontSize={"14px"}
                            color={"white"}
                            py={"20px"}
                          >
                            Sumber
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {seed?.sumberDanaSeed?.map((item, idx) => (
                          <Tr key={item.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {idx + 1}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item.sumber}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </Layout>
  );
}

export default Pengaturan;
