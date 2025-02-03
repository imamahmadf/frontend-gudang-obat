import {
  Box,
  Center,
  Container,
  Text,
  Image,
  Flex,
  FormControl,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import LogoAPP from "../assets/logo app.png";
import Batik from "../assets/BATIK.png";

import Layout from "../Components/Layout";
import { useDisclosure } from "@chakra-ui/react";
import axios, { Axios } from "axios";
import addFoto from "./../assets/add_photo.png";
import { BsPlusCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import { BsFillFunnelFill } from "react-icons/bs";
import { BsCheckLg } from "react-icons/bs";
import AmprahanAktif from "../Components/AmprahanAktif";

function ObatMasuk() {
  const [keyword, setKeyword] = useState("");
  const [dataObat, setDataObat] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();
  async function fetchDataObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get/obat-masuk?search_query=${keyword}`
      )
      .then((res) => {
        setDataObat(res.data.result);
        setStatus(res.data.resultStatus);
        // console.log(res.data);
        onFilterClose();
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  function inputHandler(event) {
    const tes = setTimeout(() => {
      //console.log(event.target.value);
      const { value } = event.target;

      setKeyword(value);
    }, 2000);
  }

  function tolak(e) {
    // console.log(e, "DDDDDDDDDDDDDDDDDDDS");
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/tolak`, {
        id: e.noBatchId,
        old_img: e.old_img,
      })
      .then((res) => {
        // console.log(res.data);
        setSelectedBatch(null);
        onDeleteClose();
        fetchDataObat();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function terima(e) {
    // console.log(e, "DATAAAAAA");
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/terima`, {
        noBatch: e.noBatch,
        noBatchId: e.noBatchId,
        exp: e.exp,
        stok: e.stok,
        obatId: e.obatId,
        totalStok: e.totalStok + e.stok,
        perusahaanId: e.perusahaanId,
      })
      .then((res) => {
        // console.log(res.data);
        setSelectedBatch(null);
        onFilterClose();
        fetchDataObat();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function formatDate(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month}, ${year}`;
  }

  function renderObat() {
    return dataObat?.map((val, idx) => {
      return (
        <>
          {val.noBatches.map((val2, idx2) => {
            const newExp = formatDate(val2.exp);
            return (
              <>
                <Box
                  display={{ ss: "block", sl: "none" }}
                  p={"10px"}
                  w={"100%"}
                  borderRadius={"5px"}
                  border={"1px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  my={"20px"}
                >
                  <Box>
                    <Image
                      borderRadius={"5px"}
                      alt="foto obat"
                      width="100%"
                      height="300px"
                      me="10px"
                      overflow="hiden"
                      objectFit="cover"
                      src={
                        val2.pic
                          ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                            val2.pic
                          : addFoto
                      }
                    />{" "}
                  </Box>
                  <Text fontSize={"20px"} fontWeight={600} align={"center"}>
                    {val.nama}
                  </Text>{" "}
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Th>Kelas Terapi </Th>
                        <Td>
                          <Text fontSize={"13px"}>{val.kelasterapi.nama}</Text>{" "}
                        </Td>
                      </Tr>{" "}
                      <Tr>
                        <Th>Satuan</Th>
                        <Td>
                          <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                            {val.satuan.nama}
                          </Text>{" "}
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>EXP</Th>
                        <Td>
                          <Box
                            borderRadius={"5px"}
                            color={
                              new Date(newExp) <=
                              new Date(
                                new Date().setMonth(new Date().getMonth() + 3)
                              )
                                ? "white"
                                : "black"
                            }
                            ps={"10px"}
                            me={"10px"}
                            h={"20px"}
                            backgroundColor={
                              new Date(newExp) <=
                              new Date(
                                new Date().setMonth(new Date().getMonth() + 3)
                              )
                                ? "danger"
                                : ""
                            }
                          >
                            <Text width={"80px"} fontSize={"13px"}>
                              {newExp}
                            </Text>
                          </Box>
                        </Td>
                      </Tr>{" "}
                      <Tr>
                        <Th>No. Batch</Th>
                        <Td>
                          <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                            {val2.noBatch}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Asal</Th>
                        <Td>
                          <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                            {val2.perusahaan.nama}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>stok</Th>
                        <Td>
                          <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                            {val2.stok}
                          </Text>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                  <Flex justifyContent="flex-end" mt={"20px"}>
                    <Center
                      // onClick={onFilterOpen}
                      onClick={() => {
                        setSelectedBatch({
                          nama: val.nama,
                          noBatch: val2.noBatch,
                          noBatchId: val2.id,
                          exp: val2.exp,
                          stok: val2.stok,
                          obatId: val.id,
                          totalStok: val.totalStok,
                          perusahaanId: val2.perusahaanId,
                        });
                        onFilterOpen();
                      }}
                      borderRadius={"5px"}
                      as="button"
                      h="40px"
                      w="40px"
                      fontSize="15px"
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      color="white"
                      me={"10px"}
                      _hover={{
                        bg: "black",
                      }}
                      bg="primary"
                    >
                      <BsCheckLg />
                    </Center>
                    <Center
                      onClick={() => {
                        setSelectedBatch({
                          nama: val.nama,
                          noBatch: val2.noBatch,
                          noBatchId: val2.id,
                          exp: val2.exp,
                          stok: val2.stok,
                          obatId: val.id,
                          totalStok: val.totalStok,
                          perusahaanId: val2.perusahaanId,
                          old_img: val2.pic,
                        });
                        onDeleteOpen();
                      }}
                      borderRadius={"5px"}
                      as="button"
                      h="40px"
                      w="40px"
                      fontSize="15px"
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      color="white"
                      me={"10px"}
                      _hover={{
                        bg: "black",
                      }}
                      bg="danger"
                    >
                      X
                    </Center>
                  </Flex>
                </Box>
              </>
            );
          })}{" "}
          <Flex
            display={{ ss: "none", sl: "flex" }}
            px={"30px"}
            py={"15px"}
            borderTop={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            key={idx}
          >
            <Flex>
              <Text fontSize={"13px"} width={"190px"} me={"10px"}>
                {val.nama}
              </Text>
              <Text fontSize={"13px"} width={"120px"} me={"10px"}>
                {val.kelasterapi.nama}
              </Text>{" "}
              <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                {val.satuan.nama}
              </Text>{" "}
              <Box>
                <Flex
                  key={val.nama}
                  flexDirection={"column"}
                  justifyContent={"flex-end"}
                >
                  {val.noBatches.map((val2, idx2) => {
                    const newExp = formatDate(val2.exp);
                    return (
                      <>
                        <Flex key={val2.noBatch} justifyContent={"flex-end"}>
                          <Box>
                            <Flex>
                              <Text
                                fontSize={"13px"}
                                width={"80px"}
                                me={"10px"}
                              >
                                {val2.noBatch}
                              </Text>
                              <Box
                                borderRadius={"5px"}
                                color={
                                  new Date(newExp) <=
                                  new Date(
                                    new Date().setMonth(
                                      new Date().getMonth() + 3
                                    )
                                  )
                                    ? "white"
                                    : "black"
                                }
                                ps={"10px"}
                                me={"10px"}
                                h={"20px"}
                                backgroundColor={
                                  new Date(newExp) <=
                                  new Date(
                                    new Date().setMonth(
                                      new Date().getMonth() + 3
                                    )
                                  )
                                    ? "danger"
                                    : ""
                                }
                              >
                                <Text width={"80px"} fontSize={"13px"}>
                                  {newExp}
                                </Text>
                              </Box>
                              <Text
                                fontSize={"13px"}
                                width={"100px"}
                                me={"10px"}
                              >
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(val2.harga)}
                              </Text>{" "}
                              <Box w={"100px"} me={"10px"}>
                                <Image
                                  borderRadius={"5px"}
                                  alt="foto obat"
                                  width="30px"
                                  height="40px"
                                  me="10px"
                                  overflow="hiden"
                                  objectFit="cover"
                                  src={
                                    val2.pic
                                      ? import.meta.env
                                          .VITE_REACT_APP_API_BASE_URL +
                                        val2.pic
                                      : addFoto
                                  }
                                />{" "}
                              </Box>
                              <Text
                                fontSize={"13px"}
                                width={"100px"}
                                me={"10px"}
                              >
                                {val2.perusahaan.nama}
                              </Text>
                            </Flex>
                          </Box>
                          <Spacer />

                          <Text fontSize={"13px"} width={"140px"} me={"10px"}>
                            {val2.stok}
                          </Text>

                          <Flex justifyContent="flex-end">
                            <Center
                              // onClick={onFilterOpen}
                              onClick={() => {
                                setSelectedBatch({
                                  nama: val.nama,
                                  noBatch: val2.noBatch,
                                  noBatchId: val2.id,
                                  exp: val2.exp,
                                  stok: val2.stok,
                                  obatId: val.id,
                                  totalStok: val.totalStok,
                                  perusahaanId: val2.perusahaanId,
                                });
                                onFilterOpen();
                              }}
                              borderRadius={"5px"}
                              as="button"
                              h="30px"
                              w="30px"
                              fontSize="15px"
                              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                              color="white"
                              me={"10px"}
                              _hover={{
                                bg: "black",
                              }}
                              bg="primary"
                            >
                              <BsCheckLg />
                            </Center>
                            <Center
                              onClick={() => {
                                setSelectedBatch({
                                  nama: val.nama,
                                  noBatch: val2.noBatch,
                                  noBatchId: val2.id,
                                  exp: val2.exp,
                                  stok: val2.stok,
                                  obatId: val.id,
                                  totalStok: val.totalStok,
                                  perusahaanId: val2.perusahaanId,
                                  old_img: val2.pic,
                                });
                                onDeleteOpen();
                              }}
                              borderRadius={"5px"}
                              as="button"
                              h="30px"
                              w="30px"
                              fontSize="15px"
                              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                              color="white"
                              me={"10px"}
                              _hover={{
                                bg: "black",
                              }}
                              bg="danger"
                            >
                              X
                            </Center>
                          </Flex>
                        </Flex>{" "}
                      </>
                    );
                  })}
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </>
      );
    });
  }

  useEffect(() => {
    fetchDataObat();
    //console.log(bank);
  }, []);
  return (
    <>
      <Layout>
        <Box
          pt={"80px"}
          bgColor={"rgba(249, 250, 251, 1)"}
          backgroundImage={`url(${Batik})`}
          pb={"40px"}
        >
          {status.length === 0 ? (
            dataObat.length === 0 ? (
              <>
                <Container
                  p={"15px"}
                  bgColor={"white"}
                  borderRadius={"5px"}
                  border={"1px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  maxW={"1280px"}
                  h={"60vh"}
                  mt={"20px"}
                >
                  <Center h={"100%"}>
                    <Text>Data Obat tidak Ditemukan</Text>
                  </Center>
                </Container>
              </>
            ) : (
              <>
                <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
                  <Container
                    bgColor={"white"}
                    borderRadius={"5px"}
                    border={"1px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    maxW={"1280px"}
                  >
                    {" "}
                    <Box pt={"24px"} pb={"16px"} px={"30px"}>
                      <HStack>
                        <HStack>
                          <Text fontSize={"20px"} fontWeight={600}>
                            Daftar Obat Masuk
                          </Text>
                        </HStack>
                        <Spacer />
                        <HStack>
                          <FormControl>
                            <HStack>
                              {" "}
                              <Input
                                onChange={inputHandler}
                                type="name"
                                placeholder="Cari Obat"
                                borderRadius="8px"
                                borderColor="rgba(175, 175, 175, 1)"
                                width={"200px"}
                              />{" "}
                            </HStack>
                          </FormControl>
                        </HStack>
                      </HStack>
                    </Box>
                    <Flex
                      px={"30px"}
                      py={"15px"}
                      borderTop={"1px"}
                      borderColor={"rgba(229, 231, 235, 1)"}
                      display={{ ss: "none", sl: "block" }}
                    >
                      <Flex fontSize={"15px"} fontWeight={600} me={"10px"}>
                        <Text width={"190px"} me={"10px"}>
                          Nama Obat
                        </Text>
                        <Text width={"120px"} me={"10px"}>
                          Kelas Terapi
                        </Text>{" "}
                        <Text width={"80px"} me={"10px"}>
                          Satuan
                        </Text>{" "}
                        <Text width={"80px"} me={"10px"}>
                          No. Batch
                        </Text>
                        <Text width={"100px"} me={"10px"}>
                          EXP
                        </Text>{" "}
                        <Text width={"100px"} me={"10px"}>
                          harga Satuan
                        </Text>
                        <Text width={"100px"} me={"10px"}>
                          foto
                        </Text>{" "}
                        <Text width={"100px"} me={"10px"}>
                          asal
                        </Text>
                        <Text width={"100px"} me={"10px"}>
                          Stok
                        </Text>
                        <Spacer />
                        <Text align={"right"} width={"100px"} me={"10px"}>
                          Aksi
                        </Text>
                      </Flex>
                    </Flex>{" "}
                    {renderObat()}
                  </Container>
                </Box>
              </>
            )
          ) : (
            <>
              <Container
                bgColor={
                  status?.StatusAmprahanId <= 3
                    ? "primary"
                    : status?.StatusAmprahanId === 7
                    ? "danger"
                    : status?.StatusAmprahanId === 4
                    ? "biru"
                    : "white"
                }
                borderRadius={"5px"}
                border={"1px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                maxW={"1280px"}
                marginBottom={"20px"}
                padding={"20px"}
              >
                <AmprahanAktif data={status} />
              </Container>
            </>
          )}

          {selectedBatch && (
            <>
              <Modal
                closeOnOverlayClick={false}
                isOpen={isFilterOpen}
                // onClose={onFilterClose}
                onClose={() => {
                  setSelectedBatch(null);
                  onFilterClose();
                }}
              >
                <ModalOverlay />
                <ModalContent borderRadius={0}>
                  <ModalHeader>Terima barang Masuk</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <Table>
                      <Tbody>
                        <Tr>
                          <Td>Nama</Td>
                          <Td>: {selectedBatch.nama}</Td>
                        </Tr>
                        <Tr>
                          <Td>No. Batch</Td>
                          <Td>: {selectedBatch.noBatch}</Td>
                        </Tr>
                        <Tr>
                          <Td>Stok</Td>
                          <Td>: {selectedBatch.stok}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      bg={"primary"}
                      color={"white"}
                      _hover={{
                        bg: "black",
                      }}
                      onClick={() => {
                        terima(selectedBatch);
                      }}
                    >
                      Terima
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Modal
                closeOnOverlayClick={false}
                isOpen={isDeleteOpen}
                // onClose={onDeleteClose}
                onClose={() => {
                  setSelectedBatch(null);
                  onDeleteClose();
                }}
              >
                <ModalOverlay />
                <ModalContent borderRadius={0}>
                  <ModalHeader>Tolak Barang Masuk</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <Table>
                      <Tbody>
                        <Tr>
                          <Td>Nama</Td>
                          <Td>: {selectedBatch.nama}</Td>
                        </Tr>
                        <Tr>
                          <Td>No. Batch</Td>
                          <Td>: {selectedBatch.noBatch}</Td>
                        </Tr>
                        <Tr>
                          <Td>Stok</Td>
                          <Td>: {selectedBatch.stok}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      bg={"danger"}
                      color={"white"}
                      _hover={{
                        bg: "black",
                      }}
                      onClick={() => {
                        tolak(selectedBatch);
                      }}
                    >
                      Tolak
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
        </Box>
      </Layout>
    </>
  );
}

export default ObatMasuk;
