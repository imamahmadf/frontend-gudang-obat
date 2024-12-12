import React from "react";
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
  Tooltip,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Stack,
} from "@chakra-ui/react";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import Sidebar from "../Components/Sidebar";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { BsPlusCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import { BsFillFunnelFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import TambahAmprahanItem from "../Components/TambahAmprahanItem";
import TambahAlokasiItem from "../Components/TambahAlokasiItem";
import Layout from "../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import addFoto from "./../assets/add_photo.png";

function DaftarObatAlkes() {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [alfabet, setAlfabet] = useState("");
  const [time, setTime] = useState("");
  const [dataObat, setDataObat] = useState([]);
  const [aset, setAset] = useState([]);
  const [status, setStatus] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const global = useSelector((state) => state.user);
  console.log(global, "CEK REDUXX");
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

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

  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        console.log(res.data[0], "STATUSSSS");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchDataObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get?search_query=${keyword}&alfabet=${alfabet}&time=${time}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        setDataObat(res.data.result.rows);
        setAset(res.data.totalAset);
        onFilterClose();
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "name") {
      setAlfabet(value);
    } else if (field === "time") {
      setTime(value);
    }
  }

  function inputHandler(event) {
    const tes = setTimeout(() => {
      //console.log(event.target.value);
      const { value } = event.target;

      setKeyword(value);
    }, 2000);
  }
  function renderObat() {
    return dataObat.map((val, idx) => {
      return (
        <>
          <Flex
            px={"30px"}
            py={"15px"}
            borderTop={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            key={val.id}
            display={{ ss: "none", sl: "block" }}
          >
            <Flex>
              <Flex>
                <Image
                  borderRadius={"5px"}
                  alt="foto obat"
                  width="30px"
                  height="40px"
                  me="10px"
                  overflow="hiden"
                  objectFit="cover"
                  src={
                    val.noBatches[0]?.pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        val?.noBatches[0]?.pic
                      : addFoto
                  }
                />
                <Text fontSize={"13px"} width={"150px"} me={"10px"}>
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
                      <Flex key={val2.noBatch} justifyContent={"flex-end"}>
                        <Box>
                          <Flex mb={"5px"}>
                            <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                              {val2.noBatch}
                            </Text>
                            <Box
                              width={"80px"}
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
                              backgroundColor={
                                new Date(newExp) <=
                                new Date(
                                  new Date().setMonth(new Date().getMonth() + 3)
                                )
                                  ? "danger"
                                  : ""
                              }
                            >
                              <Text fontSize={"13px"}>{newExp}</Text>
                            </Box>
                            <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(val2.harga)}
                            </Text>{" "}
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
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
                <Flex justifyContent={"end"} pt={"10px"}>
                  <Text fontSize={"13px"} fontWeight={600}>
                    jumlah Stok:{" "}
                    {val.noBatches.reduce(
                      (total, batch) => total + batch.stok,
                      0
                    )}
                  </Text>
                </Flex>
              </Box>
              <Flex marginStart={"60px"}>
                {val.noBatches[0] ? (
                  <>
                    {" "}
                    {status?.StatusAmprahanId < 4 ? (
                      <TambahAmprahanItem
                        userId={1}
                        data={val.noBatches}
                        id={val.id}
                      />
                    ) : status?.StatusAmprahanId === 4 ? (
                      <Button
                        onClick={() => {
                          history.push(`/gfk/alokasi-item/${val.id}`);
                        }}
                      >
                        alokasi
                      </Button>
                    ) : null}
                    <Menu>
                      <MenuButton
                        p={0}
                        h="25px"
                        w="25px"
                        fontSize="12px"
                        as={Button}
                      ></MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            history.push(`/gfk/detail-obat/${val.id}`);
                          }}
                        >
                          Detail Obat
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            history.push(`/gfk/edit-obat/${val.id}`);
                          }}
                        >
                          Edit Obat
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : null}
              </Flex>
            </Flex>
          </Flex>
          {/* //////MOBILE/////////// */}
          <Link to={"/gfk/detail-obat/" + val.id}>
            <Box
              display={{ ss: "block", sl: "none" }}
              p={"10px"}
              my={"20px"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
            >
              {" "}
              <Flex>
                <Text
                  fontSize={"16px"}
                  fontWeight={600}
                  me={"10px"}
                  mb={"10px"}
                  maxW={"240px"}
                >
                  {val.nama}
                </Text>
                <Spacer />
                <Stack>
                  {val.noBatches[0] ? (
                    <>
                      {status ? null : (
                        <TambahAmprahanItem
                          userId={1}
                          data={val.noBatches}
                          id={val.id}
                        />
                      )}
                      <Menu>
                        <MenuButton
                          p={0}
                          h="25px"
                          w="10px"
                          fontSize="12px"
                          as={Button}
                        ></MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              history.push(`/gfk/detail-obat/${val.id}`);
                            }}
                          >
                            Detail Obat
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              history.push(`/edit-obat/${val.id}`);
                            }}
                          >
                            Edit Obat
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </>
                  ) : null}
                </Stack>
              </Flex>
              <Flex>
                {" "}
                <Image
                  borderRadius={"5px"}
                  alt="foto obat"
                  width="70px"
                  height="90px"
                  me="10px"
                  overflow="hiden"
                  objectFit="cover"
                  src={
                    val.noBatches[0]?.pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        val?.noBatches[0]?.pic
                      : addFoto
                  }
                />{" "}
                <Box>
                  {" "}
                  {val.noBatches.map((val2, idx2) => {
                    const newExp = formatDate(val2.exp);
                    return (
                      <Flex
                        key={val2.noBatch}
                        justifyContent={"flex-end"}
                        mb={"5px"}
                      >
                        <Box>
                          <Flex>
                            <Text fontSize={"13px"} width={"70px"} me={"10px"}>
                              {val2.noBatch}
                            </Text>
                            <Box
                              width={"80px"}
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
                              backgroundColor={
                                new Date(newExp) <=
                                new Date(
                                  new Date().setMonth(new Date().getMonth() + 3)
                                )
                                  ? "danger"
                                  : ""
                              }
                            >
                              <Text fontSize={"13px"}>{newExp}</Text>
                            </Box>
                          </Flex>
                        </Box>
                        <Spacer />

                        <Flex justifyContent={"flex-end"}>
                          <Text align={"right"} fontSize={"13px"} ms={"10px"}>
                            {val2.stok}
                          </Text>
                        </Flex>
                      </Flex>
                    );
                  })}
                </Box>{" "}
              </Flex>
            </Box>
          </Link>
        </>
      );
    });
  }

  useEffect(() => {
    fetchDataObat();
    fetchStatus();
    console.log(status);
  }, [keyword, page]);
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
            marginBottom={"20px"}
            padding={"20px"}
          >
            <Box backgroundColor={"danger"}>
              <Text>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(aset)}
              </Text>
            </Box>
            <Box>
              <Text></Text>
            </Box>
          </Container>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
          >
            {" "}
            <Box>
              <HStack flexDirection={{ ss: "row", sl: "row" }}>
                <Text
                  fontSize={"20px"}
                  fontWeight={600}
                  display={{ ss: "none", sl: "block" }}
                >
                  Daftar Obat
                </Text>

                <Spacer display={{ ss: "none", sl: "block" }} />
                <HStack>
                  <FormControl>
                    <HStack p={0}>
                      <Input
                        onChange={inputHandler}
                        type="name"
                        placeholder="Cari Obat"
                        borderRadius="8px"
                        borderColor="rgba(175, 175, 175, 1)"
                        width={"200px"}
                      />{" "}
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
                      <Button
                        leftIcon={<BsPlusCircle />}
                        color="rgba(175, 175, 175, 1)"
                        aria-label="toggle filters"
                        variant="solid"
                        backgroundColor="white"
                        border="1px"
                        borderRadius={"8px"}
                        onClick={() => {
                          history.push("/gfk/tambah-obat");
                        }}
                      ></Button>
                    </HStack>
                  </FormControl>
                </HStack>
              </HStack>
            </Box>
            <Box display={{ ss: "none", sl: "block" }}>
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
                      width={"80px"}
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
            </Box>
            <Box display={{ ss: "block", sl: "none" }}>{renderObat()}</Box>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 20,
                boxSizing: "border-box",
                width: "100%",
                height: "100%",
              }}
            >
              <ReactPaginate
                previousLabel={<BsCaretLeftFill />}
                nextLabel={<BsCaretRightFill />}
                pageCount={pages}
                onPageChange={changePage}
                activeClassName={"item active "}
                breakClassName={"item break-me "}
                breakLabel={"..."}
                containerClassName={"pagination"}
                disabledClassName={"disabled-page"}
                marginPagesDisplayed={2}
                nextClassName={"item next "}
                pageClassName={"item pagination-page "}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
              />
            </div>
          </Container>
        </Box>
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
              <Select
                placeholder="short by name"
                borderRadius={0}
                onClick={(e) => selectHandler(e, "name")}
              >
                <option value="ASC">name: A-Z</option>
                <option value="DESC">name: Z-A</option>
              </Select>
            </ModalBody>
            <ModalBody pb={6} name="time">
              <Select
                placeholder="short by time"
                borderRadius={0}
                onClick={(e) => selectHandler(e, "time")}
              >
                <option value="DESC">Newest </option>
                <option value="ASC">Latest</option>
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={fetchDataObat}
                variant="primary"
                borderRadius={0}
                colorScheme="danger"
                mr={0}
                w="100%"
              >
                Apply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default DaftarObatAlkes;
