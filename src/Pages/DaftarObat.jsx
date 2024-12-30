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
import { BsFillBoxSeamFill } from "react-icons/bs";
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
import TambahObatRusak from "../Components/TambahObatRusak";
import AmprahanAktif from "../Components/AmprahanAktif";

function DaftarObatAlkes() {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [alfabet, setAlfabet] = useState("");
  const [time, setTime] = useState("");
  const [dataObat, setDataObat] = useState([]);
  const [aset, setAset] = useState([]);
  const [status, setStatus] = useState([]);
  const [randomNumber, setRandomNumber] = useState(0);
  const [kelasTerapiId, setKelasTerapiId] = useState(0);
  const [kategoriId, setKategoriId] = useState(0);
  const [satuanId, setSatuanId] = useState(0);
  const [seed, setSeed] = useState([]);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const { UserRoles, profileId } = useSelector((state) => state.user);

  function handleChange(event, field) {
    const { value } = event.target;
    if (field === "kelasTerapiId") {
      setKelasTerapiId(value);
      // console.log(value);
    } else if (field === "kategoriId") {
      setKategoriId(value);
    } else if (field === "satuanId") {
      setSatuanId(value);
    }
  }

  function renderKelasTerapi() {
    return seed?.kelasterapiSeed?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderKategori() {
    return seed?.kategoriSeed?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderSatuan() {
    return satuanId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  function renderSatuan() {
    return seed?.satuanSeed?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  async function fetchDataSeed() {
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
        }/obat/get?search_query=${keyword}&alfabet=${alfabet}&time=${time}&page=${page}&limit=${limit}&kelasTerapiId=${kelasTerapiId}&kategoriId=${kategoriId}&satuanId=${satuanId}`
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
            py={"15px"}
            borderTop={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            key={val.id}
            display={{ ss: "none", sl: "block" }}
          >
            <Flex>
              <Flex
                onClick={() => {
                  history.push(`/gfk/detail-obat/${val.id}`);
                }}
              >
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
                <Text fontSize={"13px"} width={"120px"} me={"10px"}>
                  {val.kelasterapi.nama}
                </Text>{" "}
                <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                  {val.kategori.nama}
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
                                  new Date().setMonth(
                                    new Date().getMonth() + 1,
                                    0
                                  )
                                )
                                  ? "white"
                                  : "black"
                              }
                              ps={"10px"}
                              me={"10px"}
                              backgroundColor={
                                new Date(newExp) <=
                                new Date(
                                  new Date().setMonth(
                                    new Date().getMonth() + 1,
                                    0
                                  )
                                )
                                  ? "danger"
                                  : new Date(newExp) <=
                                    new Date(
                                      new Date().setMonth(
                                        new Date().getMonth() + 6,
                                        0
                                      )
                                    )
                                  ? "orange"
                                  : ""
                              }
                            >
                              <Text fontSize={"13px"}>{newExp}</Text>
                            </Box>
                            <Text
                              fontSize={"13px"}
                              width={"100px"}
                              me={"10px"}
                              display={
                                UserRoles.includes(2) ||
                                UserRoles.includes(8) ||
                                UserRoles.includes(7)
                                  ? "block"
                                  : "none"
                              }
                            >
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(val2.harga)}
                            </Text>{" "}
                          </Flex>
                        </Box>
                        <Spacer />

                        <Flex
                          justifyContent={"flex-end"}
                          display={
                            UserRoles.includes(2) ||
                            UserRoles.includes(8) ||
                            UserRoles.includes(7)
                              ? "block"
                              : "none"
                          }
                        >
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
                <Flex
                  justifyContent={"end"}
                  pt={"10px"}
                  display={
                    UserRoles.includes(2) ||
                    UserRoles.includes(8) ||
                    UserRoles.includes(7)
                      ? "flex"
                      : "none"
                  }
                >
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
                <>
                  {UserRoles.includes(7) || UserRoles.includes(8) ? (
                    <>
                      {" "}
                      {status?.StatusAmprahanId < 4 ? (
                        <TambahAmprahanItem
                          userId={1}
                          data={val.noBatches}
                          randomNumber={setRandomNumber}
                          id={val.id}
                        />
                      ) : status?.StatusAmprahanId === 4 ? (
                        <Tooltip label="alokasi" aria-label="A tooltip">
                          <Center
                            onClick={() => {
                              history.push(`/gfk/alokasi-item/${val.id}`);
                            }}
                            borderRadius={"5px"}
                            as="button"
                            h="25px"
                            w="25px"
                            fontSize="12px"
                            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                            color="white"
                            _hover={{
                              bg: "black",
                            }}
                            bg="biru"
                            // onClick={onOpen}
                          >
                            <BsFillBoxSeamFill />
                          </Center>
                        </Tooltip>
                      ) : status?.StatusAmprahanId === 7 ? (
                        <>
                          <TambahObatRusak
                            userId={1}
                            data={val.noBatches}
                            id={val.id}
                            randomNumber={setRandomNumber}
                          />
                        </>
                      ) : null}
                    </>
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
                      {val.profileId === profileId ? (
                        <MenuItem
                          onClick={() => {
                            history.push(`/gfk/edit-obat/${val.id}`);
                          }}
                        >
                          Edit Obat
                        </MenuItem>
                      ) : null}
                    </MenuList>
                  </Menu>
                </>
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
                                  new Date().setMonth(
                                    new Date().getMonth() + 1,
                                    0
                                  )
                                )
                                  ? "white"
                                  : "black"
                              }
                              ps={"10px"}
                              me={"10px"}
                              backgroundColor={
                                new Date(newExp) <=
                                new Date(
                                  new Date().setMonth(
                                    new Date().getMonth() + 1,
                                    0
                                  )
                                )
                                  ? "danger"
                                  : new Date(newExp) <=
                                    new Date(
                                      new Date().setMonth(
                                        new Date().getMonth() + 6,
                                        0
                                      )
                                    )
                                  ? "orange"
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
    fetchDataSeed();
    console.log(status);
  }, [keyword, page, randomNumber, satuanId, kelasTerapiId, kategoriId]);
  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
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
            <Box>
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
            {status ? (
              <AmprahanAktif randomNumber={setRandomNumber} data={status} />
            ) : null}
          </Container>

          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            mb={"15px"}
            p={"20px"}
          >
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
                      {UserRoles.includes(3) ||
                      UserRoles.includes(4) ||
                      UserRoles.includes(7) ||
                      UserRoles.includes(8) ? (
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
                      ) : null}
                    </HStack>
                  </FormControl>
                </HStack>
              </HStack>
              <HStack>
                <FormControl>
                  <Select
                    mt="5px"
                    placeholder="Kelas Terapi"
                    border="1px"
                    borderRadius={"8px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    onChange={(e) => handleChange(e, "kelasTerapiId")}
                  >
                    {renderKelasTerapi()}
                  </Select>
                </FormControl>{" "}
                <FormControl>
                  <Select
                    mt="5px"
                    placeholder="Kategori"
                    border="1px"
                    borderRadius={"8px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    onChange={(e) => handleChange(e, "kategoriId")}
                  >
                    {renderKategori()}
                  </Select>
                </FormControl>
                <FormControl>
                  <Select
                    mt="5px"
                    placeholder="Satuan"
                    border="1px"
                    borderRadius={"8px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    onChange={(e) => handleChange(e, "satuanId")}
                  >
                    {renderSatuan()}
                  </Select>
                </FormControl>
                <Button
                  onClick={() => {
                    setKeyword("");
                    setAlfabet("");
                    setTime("");
                    setPage(0);
                    setKelasTerapiId(0);
                    setKategoriId(0);
                    setSatuanId(0);
                  }}
                >
                  reset
                </Button>
              </HStack>
            </Box>
          </Container>
          {rows ? (
            <Container
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              maxW={"1280px"}
            >
              {" "}
              <Box display={{ ss: "none", sl: "block" }}>
                <Flex
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
                        width={"120px"}
                        me={"10px"}
                      >
                        Kelas Terapi
                      </Text>{" "}
                      <Text
                        fontSize={"15px"}
                        fontWeight={600}
                        width={"100px"}
                        me={"10px"}
                      >
                        Kategori
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
                        display={
                          UserRoles.includes(2) ||
                          UserRoles.includes(8) ||
                          UserRoles.includes(7)
                            ? "block"
                            : "none"
                        }
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
                      display={
                        UserRoles.includes(2) ||
                        UserRoles.includes(8) ||
                        UserRoles.includes(7)
                          ? "block"
                          : "none"
                      }
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
          ) : (
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
          )}
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
