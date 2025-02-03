import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Image,
  Container,
  Flex,
  Spacer,
  FormControl,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Center,
  Tr,
  Th,
  Td,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  HStack,
  VStack,
  ModalFooter,
  SimpleGrid,
  Heading,
  Alert,
  Avatar,
} from "@chakra-ui/react";
import Batik from "../assets/BATIK.png";
import { useDispatch, useSelector } from "react-redux";
import AdminEditAmprahan from "../Components/AdminEditAmprahan";
import AdminEditNoBatch from "../Components/AdminEditNoBatch";
import { BsPencilFill } from "react-icons/bs";

import axios from "axios";
import Layout from "../Components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDisclosure } from "@chakra-ui/react";
function AdminObat(props) {
  const [randomNumber, setRandomNumber] = useState(0);
  const [dataAmprahan, setDataAmprahan] = useState([]);
  const [dataObat, setDataObat] = useState([]);

  const { profileId, UserRoles } = useSelector((state) => state.user);
  function formatTanggal(dateString) {
    var objekTanggal = new Date(dateString);

    // Mengambil nilai hari, bulan, dan tahun
    var hari = objekTanggal.getUTCDate();
    var bulan = objekTanggal.toLocaleString("default", { month: "short" });
    var tahun = objekTanggal.getUTCFullYear();

    // Menggabungkan hasilnya
    return `${hari} ${bulan} ${tahun}`;
  }
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  async function fetchAmprahan() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/admin/get/all-amprahan/${props.match.params.obatId}`
      )
      .then((res) => {
        setDataAmprahan(res.data.result);
        setDataObat(res.data.resultObat);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const formik = useFormik({
    initialValues: {
      totalStok: dataObat?.totalStok,
    },
    validationSchema: Yup.object().shape({
      totalStok: Yup.number("masukkan angka").required("sisa wajib diisi"),
    }),

    onSubmit: async (values) => {
      const { totalStok } = values;
      await axios
        .patch(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/admin/edit/total-stok`,
          {
            totalStok,
            id: props.match.params.obatId,
          }
        )
        .then((res) => {
          // console.log(res.data);

          fetchAmprahan();
          onEditClose();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  useEffect(() => {
    fetchAmprahan();
  }, [randomNumber]);

  return (
    <>
      <Layout>
        <Box
          pt={"80px"}
          bgColor={"secondary"}
          backgroundImage={`url(${Batik})`}
          pb={"40px"}
        >
          <Container
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            padding={"20px"}
            bgColor={"white"}
            mb={"20px"}
          >
            {/* <Text fontSize={"16px"} fontWeight={400}>
              {dataObat?.totalStok}
            </Text>{" "}
            <Text fontSize={"16px"} fontWeight={400}>
              {dataAmprahan[0]?.sisa}
            </Text>
            <Text fontSize={"16px"} fontWeight={400}>
              {dataObat?.noBatches?.reduce(
                (total, batch) => total + batch.stok,
                0
              )}
            </Text> */}
            {dataObat?.totalStok === dataAmprahan[0]?.sisa &&
            dataObat?.noBatches?.reduce(
              (total, batch) => total + batch.stok,
              0
            ) === dataAmprahan[0]?.sisa ? (
              <Box
                borderRadius={"5px"}
                p={"15px"}
                color={"white"}
                bgColor={"primary"}
              >
                Data betul
              </Box>
            ) : (
              <Box
                borderRadius={"5px"}
                p={"15px"}
                color={"white"}
                bgColor={"danger"}
              >
                Data Salah
              </Box>
            )}
          </Container>
          <Container
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            marginBottom={"20px"}
            padding={"20px"}
            bgColor={"white"}
            mb={"20px"}
          >
            <Heading mb={"10px"}>{dataObat?.nama}</Heading>
            {/* //////MOBILE//////// */}
            <Box display={{ ss: "block", sl: "none" }}>
              <SimpleGrid columns={2}>
                <Text fontSize={"14px"}>
                  Sumber Dana: {dataObat?.sumberDana?.sumber}
                </Text>{" "}
                <Text fontSize={"14px"}>
                  Kelas Terapi: {dataObat?.kelasterapi?.nama}
                </Text>{" "}
                <Text fontSize={"14px"}>
                  Kategori: {dataObat?.kategori?.nama}
                </Text>{" "}
                <Text fontSize={"14px"}>Satuan: {dataObat?.satuan?.nama}</Text>{" "}
                <Text fontSize={"14px"}>Total Stok: {dataObat?.totalStok}</Text>
              </SimpleGrid>{" "}
              <Center
                onClick={onEditOpen}
                borderRadius={"5px"}
                as="button"
                h="25px"
                w="25px"
                fontSize="15px"
                transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                color="white"
                _hover={{
                  bg: "black",
                }}
                bg="green"
              >
                <BsPencilFill />
              </Center>{" "}
            </Box>

            {/* ////////MOBILE/////// */}
            <Flex gap={"15px"} display={{ ss: "none", sl: "flex" }}>
              {" "}
              <Box
                borderRadius={"5px"}
                border={"1px"}
                p={"15px"}
                borderColor={"secondary"}
              >
                <Text fontSize={"16px"} fontWeight={400}>
                  Sumber Dana:
                </Text>
                <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                  {dataObat?.sumberDana?.sumber}
                </Text>
              </Box>
              <Box
                borderRadius={"5px"}
                border={"1px"}
                p={"15px"}
                borderColor={"secondary"}
              >
                <Text fontSize={"16px"} fontWeight={400}>
                  Kelas terapi:
                </Text>
                <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                  {dataObat?.kelasterapi?.nama}
                </Text>
              </Box>
              <Box
                borderRadius={"5px"}
                border={"1px"}
                p={"15px"}
                borderColor={"secondary"}
              >
                <Text fontSize={"16px"} fontWeight={400}>
                  Kategori:
                </Text>
                <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                  {dataObat?.kategori?.nama}
                </Text>
              </Box>{" "}
              <Box
                borderRadius={"5px"}
                border={"1px"}
                p={"15px"}
                borderColor={"secondary"}
              >
                <Text fontSize={"16px"} fontWeight={400}>
                  Satuan:
                </Text>
                <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                  {dataObat?.satuan?.nama}
                </Text>
              </Box>
              <HStack
                borderRadius={"5px"}
                border={"1px"}
                p={"15px"}
                borderColor={"secondary"}
              >
                <Box>
                  <Text fontSize={"16px"} fontWeight={400}>
                    Total Stok:
                  </Text>
                  <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                    {dataObat?.totalStok}
                  </Text>
                </Box>{" "}
                <Box>
                  <Center
                    onClick={onEditOpen}
                    borderRadius={"5px"}
                    as="button"
                    h="25px"
                    w="25px"
                    fontSize="15px"
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    color="white"
                    _hover={{
                      bg: "black",
                    }}
                    bg="green"
                  >
                    <BsPencilFill />
                  </Center>{" "}
                </Box>
              </HStack>
            </Flex>
            <Box style={{ overflowX: "auto" }}>
              <Table variant="simple" size="sm" mt={2}>
                <Thead bgColor={"primary"}>
                  <Tr>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      No.
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      No. Batch
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      EXP
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Harga
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Kotak
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Stok
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataObat?.noBatches?.map((val, idx) => {
                    return (
                      <Tr key={idx}>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {idx + 1}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {val.noBatch}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {formatTanggal(val.exp)}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {val.harga}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {val.kotak}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          {val.stok}
                        </Td>
                        <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                          <AdminEditNoBatch
                            data={val}
                            randomNumber={setRandomNumber}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </Container>
          <Container
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            marginBottom={"20px"}
            padding={"20px"}
            bgColor={"white"}
          >
            <Box style={{ overflowX: "auto" }}>
              <Table variant="simple" size="sm" mt={2}>
                <Thead bgColor={"primary"}>
                  <Tr>
                    <Th fontSize={"14px"} color={"white"}>
                      Tanggal
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Nomor Batch
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Tujuan
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Masuk
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Keluar
                    </Th>

                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Sisa Stok
                    </Th>

                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Jenis
                    </Th>
                    <Th fontSize={"14px"} color={"white"} py={"15px"}>
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataAmprahan
                    ?.slice()
                    .reverse()
                    .map((val, idx) => {
                      // Menggunakan slice() untuk menghindari mutasi array asli
                      const tanggal = formatTanggal(val.amprahan.tanggal);
                      // ... existing logic for sisaStok ...

                      return (
                        <Tr key={`${idx}`}>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {tanggal}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.noBatch?.noBatch}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.amprahan?.uptd?.nama}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.amprahan?.uptd?.statusTujuanId === 2
                              ? val.permintaan
                              : "-"}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.amprahan?.uptd?.statusTujuanId === 1 ||
                            val.amprahan?.uptd?.statusTujuanId === 4
                              ? val.permintaan
                              : "-"}
                          </Td>

                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.sisa}
                          </Td>

                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {val.amprahan.StatusAmprahan?.nama}
                            <br />
                            {val.amprahan?.StatusAmprahan?.id === 7
                              ? val.catatan
                              : null}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            <Flex gap={4}>
                              <AdminEditAmprahan
                                data={val}
                                randomNumber={setRandomNumber}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isEditOpen}
          onClose={() => {
            onEditClose();
          }}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0}>
            <ModalHeader>edit Total Stok</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {" "}
              <FormControl>
                <Input
                  mt={"10px"}
                  type="number"
                  placeholder="stok"
                  border="1px"
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  defaultValue={dataObat?.totalStok}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    formik.setFieldValue("totalStok", value);
                  }}
                />{" "}
                {formik.errors.totalStok ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{formik.errors.totalStok}</Text>
                  </Alert>
                ) : null}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {" "}
              <Button w="100%" mb="40px" onClick={formik.handleSubmit}>
                Edit
              </Button>{" "}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default AdminObat;
