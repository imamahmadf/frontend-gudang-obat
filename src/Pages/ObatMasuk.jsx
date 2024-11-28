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
} from "@chakra-ui/react";
import LogoAPP from "../assets/logo app.png";
import Layout from "../Components/Layout";
import { useDisclosure } from "@chakra-ui/react";
import axios, { Axios } from "axios";
import { BsPlusCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import { BsFillFunnelFill } from "react-icons/bs";

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
        <Flex
          px={"30px"}
          py={"15px"}
          borderTop={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          key={idx}
        >
          <Flex>
            <Flex>
              {/* <Image
                borderRadius={"5px"}
                alt="foto obat"
                width="30px"
                height="40px"
                me="10px"
                overflow="hiden"
                objectFit="cover"
                src={import.meta.env.VITE_REACT_APP_API_BASE_URL + val.pic}
              /> */}
              <Text fontSize={"13px"} width={"190px"} me={"10px"}>
                {val.nama}
              </Text>
              <Text fontSize={"13px"} width={"160px"} me={"10px"}>
                {val.kelasterapi.nama}
              </Text>{" "}
              <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                {val.satuan.nama}
              </Text>{" "}
            </Flex>{" "}
            <Box>
              <Flex
                key={val.nama}
                flexDirection={"column"}
                justifyContent={"flex-end"}
                minW={"600px"}
              >
                {val.noBatches.map((val2, idx2) => {
                  const newExp = formatDate(val2.exp);
                  return (
                    <>
                      <Flex key={val2.noBatch} justifyContent={"flex-end"}>
                        <Box>
                          <Flex>
                            <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                              {val2.noBatch}
                            </Text>
                            <Text
                              fontSize={"13px"}
                              width={"100px"}
                              me={"10px"}
                              backgroundColor={
                                new Date(newExp) <=
                                new Date(
                                  new Date().setMonth(new Date().getMonth() + 3)
                                )
                                  ? "red"
                                  : ""
                              }
                            >
                              {newExp}
                            </Text>
                            <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(val2.harga)}
                            </Text>{" "}
                            <Image
                              borderRadius={"5px"}
                              alt="foto obat"
                              width="30px"
                              height="40px"
                              me="10px"
                              overflow="hiden"
                              objectFit="cover"
                              src={
                                import.meta.env.VITE_REACT_APP_API_BASE_URL +
                                val2.pic
                              }
                            />{" "}
                            <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                              {val2.perusahaan.nama}
                            </Text>
                          </Flex>
                        </Box>
                        <Spacer />
                        <Flex justifyContent={"flex-end"}>
                          <Text
                            align={"right"}
                            fontSize={"13px"}
                            width={"100px"}
                            ms={"10px"}
                          >
                            {val2.stok}
                          </Text>
                        </Flex>{" "}
                        <Flex marginStart={"60px"}>
                          {" "}
                          <IconButton
                            onClick={onFilterOpen}
                            color="rgba(175, 175, 175, 1)"
                            aria-label="toggle filters"
                            icon={<BsFillFunnelFill />}
                            backgroundColor="white"
                            border="1px"
                            borderRadius={"8px"}
                            m={2}
                            _hover={{
                              bg: "black",
                              color: "white",
                            }}
                          />
                          <IconButton
                            onClick={onDeleteOpen}
                            color="rgba(175, 175, 175, 1)"
                            aria-label="toggle filters"
                            icon={<BsFillFunnelFill />}
                            backgroundColor="white"
                            border="1px"
                            borderRadius={"8px"}
                            m={2}
                            _hover={{
                              bg: "black",
                              color: "white",
                            }}
                          />
                        </Flex>
                      </Flex>{" "}
                      <Modal
                        closeOnOverlayClick={false}
                        isOpen={isFilterOpen}
                        onClose={onFilterClose}
                      >
                        <ModalOverlay />
                        <ModalContent borderRadius={0}>
                          <ModalHeader>Shory by:</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody pb={6}>
                            <Text>{val2.stok}</Text>
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              height={"20px"}
                              width={"60px"}
                              fontSize={"12px"}
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
                          <ModalHeader>Shory by:</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody pb={6}>
                            <Text>{val2.stok}</Text> DLETE
                          </ModalBody>

                          <ModalFooter>
                            <Button
                              height={"20px"}
                              width={"60px"}
                              fontSize={"12px"}
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
                          Daftar Obat
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
                  >
                    <Flex>
                      <Flex>
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"190px"}
                          me={"10px"}
                        >
                          Nama Obat
                        </Text>
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"160px"}
                          me={"10px"}
                        >
                          Kelas Terapi
                        </Text>{" "}
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"80px"}
                          me={"10px"}
                        >
                          Satuan
                        </Text>{" "}
                      </Flex>
                      <Flex>
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"80px"}
                          me={"10px"}
                        >
                          No. Batch
                        </Text>
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"100px"}
                          me={"10px"}
                        >
                          EXP
                        </Text>{" "}
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"100px"}
                          me={"10px"}
                        >
                          harga Satuan
                        </Text>
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"100px"}
                          me={"10px"}
                        >
                          foto
                        </Text>{" "}
                        <Text
                          fontSize={"15px"}
                          fontWeight={600}
                          width={"100px"}
                          me={"10px"}
                        >
                          asal
                        </Text>
                      </Flex>
                    </Flex>
                    <Spacer />
                    <Flex>
                      <Text
                        fontSize={"15px"}
                        align={"right"}
                        width={"100px"}
                        me={"10px"}
                        fontWeight={600}
                      >
                        Stok
                      </Text>
                      <Text
                        fontSize={"15px"}
                        align={"right"}
                        width={"100px"}
                        me={"10px"}
                        fontWeight={600}
                      >
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
            <Box marginTop={"250px"}>selesaikan amprahan</Box>
          </>
        )}
      </Layout>
    </>
  );
}

export default ObatMasuk;