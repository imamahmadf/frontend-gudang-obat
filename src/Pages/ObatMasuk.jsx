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
        console.log(res.data);
        onFilterClose();
        console.log(res.data);
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
    console.log(e.value, "DDDDDDDDDDDDDDDDDDDS");
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/tolak`, {
        id: e.value.id,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function terima(e) {
    console.log(e.val, "DATAAAAAA");
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/terima`, {
        noBatch: e.val2.noBatch,
        noBatchId: e.val2.id,
        exp: e.val2.exp,
        stok: e.val2.stok,
        obatId: e.val.id,
        totalStok: e.val.totalStok + e.val2.stok,
        perusahaanId: e.val2.perusahaanId,
      })
      .then((res) => {
        console.log(res.data);
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
                              onClick={onFilterOpen}
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
                              onClick={onDeleteOpen}
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
                        <Modal
                          closeOnOverlayClick={false}
                          isOpen={isFilterOpen}
                          onClose={onFilterClose}
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
                                    <Td>: {val.nama}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td>No. Batch</Td>
                                    <Td>: {val2.noBatch}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td>Stok</Td>
                                    <Td>: {val2.stok}</Td>
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
                                  terima({ val2, val });
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
                          onClose={onDeleteClose}
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
                                    <Td>: {val.nama}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td>No. Batch</Td>
                                    <Td>: {val2.noBatch}</Td>
                                  </Tr>
                                  <Tr>
                                    <Td>Stok</Td>
                                    <Td>: {val2.stok}</Td>
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
                                  tolak({ value: val2 });
                                }}
                              >
                                Tolak
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
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
        {status.length === 0 ? (
          dataObat.length === 0 ? (
            <>
              <Text marginTop={"250px"}>tidak ada dat</Text>
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
      </Layout>
    </>
  );
}

export default ObatMasuk;
