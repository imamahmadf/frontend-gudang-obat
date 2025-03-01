import React, { useEffect, useState } from "react";
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
  Avatar,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import axios from "axios";
import Batik from "../assets/BATIK.png";

import { Link, useHistory } from "react-router-dom";
import addFoto from "./../assets/add_photo.png";
import Layout from "../Components/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { BsPencilFill } from "react-icons/bs";
import DataChart from "../Components/DataChart";
import PolarChart from "../Components/PolarChart";

function DetailObat(props) {
  const [dataObat, setDataObat] = useState([]);
  const [dataAmprahan, setDataAmprahan] = useState([]);
  const [totalAset, setTotalAset] = useState(0);
  const history = useHistory();
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [time, setTime] = useState("");
  const [jenis, setJenis] = useState("");
  const [puskesmas, setPuskesmas] = useState([]);
  const [puskesmasId, setPuskesmasId] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [dataStatistik, setDataStatistik] = useState([]);
  const [tahun, setTahun] = useState(0);
  const [dataStatistikTujuanObat, setDataStatistikTujuanObat] = useState([]);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

  const { UserRoles } = useSelector((state) => state.user);

  // console.log(UserRoles, "ROLEEEEEEE");

  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "startDate") {
      setInputStartDate(value);
    } else if (field === "endDate") {
      setInputEndDate(value);
    }
  };

  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "puskesmasId") {
      setPuskesmasId(value);
      // console.log(value);
    } else if (field === "time") {
      setTime(value);
    } else if (field === "jenis") {
      setJenis(value);
    }
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

  function formatTanggal(dateString) {
    var objekTanggal = new Date(dateString);

    // Mengambil nilai hari, bulan, dan tahun
    var hari = objekTanggal.getUTCDate();
    var bulan = objekTanggal.toLocaleString("default", { month: "short" });
    var tahun = objekTanggal.getUTCFullYear();

    // Menggabungkan hasilnya
    return `${hari} ${bulan} ${tahun}`;
  }
  async function fetchDataStatistikObatTujuan() {
    // console.log(tahun);
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/statistik/get/tujuan-obat/${props.match.params.obatId}?year=${
          2000 + tahun
        }`
      )
      .then((res) => {
        setDataStatistikTujuanObat(res.data);
        // console.log(res.data, "INI DATA STATITSIK!!!!!!!!");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchDataStatistik() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/statistik/get/detail-obat/${props.match.params.obatId}?year=${
          2000 + tahun
        }`
      )
      .then((res) => {
        setDataStatistik(res.data.result);
        // console.log(res.data.result, "INI DATA STATITSIK!!!!!!!!");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchDataPuskesmas() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas`)
      .then((res) => {
        setPuskesmas(res.data.result);
        // console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function renderPuskesmas() {
    // console.log(puskesmas);
    return puskesmas?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  function renderRiwayat() {
    return (
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
              {UserRoles.includes(2) ||
              UserRoles.includes(7) ||
              UserRoles.includes(8) ? (
                <Th fontSize={"14px"} color={"white"} py={"15px"}>
                  Sisa Stok
                </Th>
              ) : null}
              <Th fontSize={"14px"} color={"white"} py={"15px"}>
                Jenis
              </Th>
              {UserRoles.includes(2) ||
              UserRoles.includes(7) ||
              UserRoles.includes(8) ? (
                <Th fontSize={"14px"} color={"white"} py={"15px"}>
                  Nilai Aset
                </Th>
              ) : null}
            </Tr>
          </Thead>
          <Tbody>
            {dataAmprahan?.map((val, idx) => {
              const newExp = formatTanggal(val.amprahan.tanggal);
              // ... existing logic for sisaStok ...

              return (
                <Tr key={`${val.id}-${idx}`}>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {newExp}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.noBatch.noBatch}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.amprahan.uptd.nama}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.amprahan.uptd.statusTujuanId === 2
                      ? val.permintaan
                      : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.amprahan.uptd.statusTujuanId === 1 ||
                    val.amprahan.uptd.statusTujuanId === 4
                      ? val.permintaan
                      : "-"}
                  </Td>
                  {UserRoles.includes(2) ||
                  UserRoles.includes(7) ||
                  UserRoles.includes(8) ? (
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {val.sisa}
                    </Td>
                  ) : null}
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.amprahan.StatusAmprahan.nama}
                    <br />
                    {val.amprahan.StatusAmprahan.id === 7 ? val.catatan : null}
                  </Td>
                  {UserRoles.includes(2) ||
                  UserRoles.includes(7) ||
                  UserRoles.includes(8) ? (
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(val.permintaan * val.noBatch.harga)}
                      {}
                    </Td>
                  ) : null}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    );
  }

  async function fetchObat() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/detail/${
          props.match.params.obatId
        }?page=${page}&limit=${limit}&startDate=${inputStartDate}&endDate=${inputEndDate}&puskesmasId=${puskesmasId}&time=${time}&jenis=${jenis}`
      )
      .then((res) => {
        setDataObat(res.data.result);
        setDataAmprahan(res.data.amprahanData.rows);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);

        // Menghitung total aset
        const totalAset = res.data?.result?.noBatches?.reduce(
          (total, batch) => {
            return total + batch.harga * batch.stok;
          },
          0
        );

        setTotalAset(totalAset); // Simpan total aset ke dalam state
        // console.log(res.data); // Menampilkan total aset di console
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchObat();
    fetchDataPuskesmas();
    fetchDataStatistik();
    fetchDataStatistikObatTujuan();
  }, [page, inputStartDate, inputEndDate, time, puskesmasId, jenis, tahun]);

  return (
    <Layout>
      <Box
        pb={"40px"}
        pt={"80px"}
        bgColor={"secondary"}
        backgroundImage={`url(${Batik})`}
      >
        {" "}
        {/* /////////MOBILE////////////// */}
        <Container
          display={{ ss: "block", sl: "none" }}
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          p={"15px"}
          borderColor={"secondary"}
          mb={"20px"}
        >
          <Text fontSize={"24px"} fontWeight={700}>
            {" "}
            {dataObat?.nama}
          </Text>
          <SimpleGrid columns={2}>
            <Text fontSize={"12px"}>
              Sumber Dana: {dataObat?.sumberDana?.sumber}
            </Text>{" "}
            <Text fontSize={"12px"}>
              Kelas Terapi: {dataObat?.kelasterapi?.nama}
            </Text>{" "}
            <Text fontSize={"12px"}>Kategori: {dataObat?.kategori?.nama}</Text>{" "}
            <Text fontSize={"12px"}>Satuan: {dataObat?.satuan?.nama}</Text>{" "}
            {UserRoles.includes(2) ||
            UserRoles.includes(7) ||
            UserRoles.includes(8) ? (
              <Text fontSize={"12px"}>Total Stok: {dataObat?.totalStok}</Text>
            ) : null}{" "}
            {UserRoles.includes(2) ||
            UserRoles.includes(7) ||
            UserRoles.includes(8) ? (
              <Text fontSize={"12px"}>
                Nilai Aset:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalAset)}
              </Text>
            ) : null}
          </SimpleGrid>
          {UserRoles.includes(3) ||
          UserRoles.includes(7) ||
          UserRoles.includes(8) ? (
            <Flex gap={4} mt={"10px"}>
              <Center
                onClick={() => {
                  history.push(`/gfk/edit-obat/${props.match.params.obatId}`);
                }}
                borderRadius={"5px"}
                as="button"
                h="25px"
                w="25px"
                fontSize="15px"
                transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                color="white"
                _hover={{
                  bg: "primaryGelap",
                }}
                bg="primary"
              >
                <BsPencilFill />
              </Center>{" "}
              {UserRoles.includes(7) || UserRoles.includes(8) ? (
                <>
                  {" "}
                  <Center
                    onClick={() => {
                      history.push(
                        `/gfk/admin-obat/${props.match.params.obatId}`
                      );
                    }}
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
                    bg="danger"
                  >
                    <BsPencilFill />
                  </Center>{" "}
                </>
              ) : null}
            </Flex>
          ) : null}
        </Container>
        <HStack
          display={{ ss: "flex", sl: "none" }}
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          p={"15px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          mb={"20px"}
        >
          <Avatar my={"5px"} borderRadius={"5px"} h={"50px"} />
          <Box>
            {" "}
            <Text fontSize={"12px"}>Penanggung Jawab:</Text>
            <Text fontSize={"20px"} fontWeight={700}>
              {dataObat?.profile?.nama}
            </Text>
          </Box>
        </HStack>
        {/* /////////MOBILE////////////// */}
        <Container
          maxW={"1280px"}
          mb={"20px"}
          p={0}
          display={{ ss: "none", sl: "block" }}
        >
          <Flex gap={"20px"}>
            <Flex
              w={"85%"}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              flexDirection={"column"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Flex>
                <Box>
                  <Heading mb={"10px"}> {dataObat?.nama}</Heading>
                  <Heading as="h6" size="md">
                    Tanggal Input: {formatTanggal(dataObat?.createdAt)}
                  </Heading>
                </Box>
                <Spacer />
                {UserRoles.includes(3) ||
                UserRoles.includes(7) ||
                UserRoles.includes(8) ? (
                  <Flex gap={4}>
                    <Center
                      onClick={() => {
                        history.push(
                          `/gfk/edit-obat/${props.match.params.obatId}`
                        );
                      }}
                      borderRadius={"5px"}
                      as="button"
                      h="25px"
                      w="25px"
                      fontSize="15px"
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      color="white"
                      _hover={{
                        bg: "primaryGelap",
                      }}
                      bg="primary"
                    >
                      <BsPencilFill />
                    </Center>{" "}
                    {UserRoles.includes(7) || UserRoles.includes(8) ? (
                      <Center
                        onClick={() => {
                          history.push(
                            `/gfk/admin-obat/${props.match.params.obatId}`
                          );
                        }}
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
                        bg="danger"
                      >
                        <BsPencilFill />
                      </Center>
                    ) : null}
                  </Flex>
                ) : null}
              </Flex>
              <Spacer />
              <Flex gap={"15px"}>
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
                {UserRoles.includes(2) ||
                UserRoles.includes(7) ||
                UserRoles.includes(8) ? (
                  <Box
                    borderRadius={"5px"}
                    border={"1px"}
                    p={"15px"}
                    borderColor={"secondary"}
                  >
                    <Text fontSize={"16px"} fontWeight={400}>
                      Total Stok:
                    </Text>
                    <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                      {dataObat?.totalStok}
                    </Text>
                  </Box>
                ) : null}
                {UserRoles.includes(2) ||
                UserRoles.includes(7) ||
                UserRoles.includes(8) ? (
                  <Box
                    borderRadius={"5px"}
                    border={"1px"}
                    p={"15px"}
                    borderColor={"secondary"}
                  >
                    <Text fontSize={"16px"} fontWeight={400}>
                      Nilai Aset:
                    </Text>
                    <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totalAset)}
                    </Text>
                  </Box>
                ) : null}
              </Flex>
            </Flex>
            <VStack
              w={"15%"}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"rgba(229, 231, 235, 1)"}
            >
              <Text fontWeight={600} align={"center"}>
                Penanggung Jawab
              </Text>
              <Avatar my={"5px"} w={"70%"} borderRadius={"5px"} h={"100px"} />
              <Text align={"center"}>{dataObat?.profile?.nama}</Text>
            </VStack>
          </Flex>
        </Container>
        {/* {databat?noBatches?.[0]} */}
        <Container
          p={"15px"}
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
        >
          <SimpleGrid minChildWidth="200px">
            <Box>
              {" "}
              {dataObat?.noBatches?.[0] ? (
                <Image
                  borderRadius={"5px"}
                  alt="property image"
                  width={{ ss: "100%", sl: "600px" }}
                  height={{ ss: "300px", sl: "600px" }}
                  me="10px"
                  overflow="hiden"
                  objectFit="cover"
                  src={
                    dataObat?.noBatches?.[0].pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        (dataObat?.noBatches?.[0]?.pic || "")
                      : addFoto
                  }
                />
              ) : null}
            </Box>
            <Box ms={{ ss: "0px", sl: "20px" }} style={{ overflowX: "auto" }}>
              <Table variant="simple" size="sm" mt={2}>
                <Thead>
                  <Tr>
                    <Th fontSize={"14px"} p={0}>
                      Nomor Batch
                    </Th>
                    <Th fontSize={"14px"}>EXP</Th>

                    {UserRoles.includes(2) ||
                    UserRoles.includes(7) ||
                    UserRoles.includes(8) ? (
                      <>
                        <Th
                          display={{ base: "none", md: "table-cell" }}
                          fontSize={"14px"}
                        >
                          Harga Satuan
                        </Th>
                        <Th fontSize={"14px"} isNumeric>
                          Stok
                        </Th>
                      </>
                    ) : null}

                    <Th fontSize={"14px"} textAlign="left">
                      detail
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataObat?.noBatches?.map((val) => {
                    const newExp = formatDate(val.exp);
                    return (
                      <Tr key={val.noBatch}>
                        <Td p={0} fontSize={"14px"}>
                          {val.noBatch}
                        </Td>
                        <Td fontSize={"14px"}>{newExp}</Td>

                        {UserRoles.includes(2) ||
                        UserRoles.includes(7) ||
                        UserRoles.includes(8) ? (
                          <>
                            <Td
                              display={{ base: "none", md: "table-cell" }}
                              fontSize={"14px"}
                            >
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(val.harga)}
                            </Td>
                            <Td fontSize={"14px"} isNumeric>
                              {val.stok}
                            </Td>
                          </>
                        ) : null}

                        <Td textAlign="left">
                          <Center
                            onClick={() => {
                              setSelectedBatch(val);
                              onDetailOpen();
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
                            bg="green"
                          >
                            <BsChevronDoubleDown />
                          </Center>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot
                  display={
                    UserRoles.includes(2) || UserRoles.includes(8)
                      ? "block"
                      : "none"
                  }
                >
                  <Tr>
                    <Th colSpan={2} fontSize={"14px"}>
                      Jumlah Stok
                    </Th>
                    <Th fontSize={"14px"} isNumeric>
                      {dataObat?.noBatches?.reduce(
                        (total, batch) => total + batch.stok,
                        0
                      )}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          </SimpleGrid>
        </Container>
        {dataObat?.noBatches?.[0] ? (
          <>
            <Container
              p={"15px"}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              maxW={"1280px"}
              mt={"20px"}
            >
              {" "}
              <FormLabel>Tanggal</FormLabel>
              <Flex>
                {" "}
                <FormControl border={"1px"} borderColor="gray.400" me="5px">
                  {" "}
                  <Text ms="18px">Awal</Text>
                  <Input
                    placeholder="Select Date and Time"
                    defaultValue={inputStartDate}
                    size="md"
                    type="date"
                    border={"none"}
                    onChange={(e) => handleChange(e, "startDate")}
                  />
                </FormControl>
                <FormControl border={"1px"} borderColor="gray.400">
                  {/* buat stardate adnn date dalm flex agar bias sevelahan(dicoba), dijadikan query nanti nya */}
                  <Text ms="18px">Akhir</Text>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    defaultValue={inputStartDate}
                    type="date"
                    border={"none"}
                    onChange={(e) => handleChange(e, "endDate")}
                  />
                </FormControl>
              </Flex>
              <SimpleGrid columns={3} gap={5} mt={"15px"} minChildWidth="300px">
                <FormControl>
                  <Select
                    placeholder="Berdasarkan Waktu"
                    borderRadius={0}
                    onClick={(e) => selectHandler(e, "time")}
                  >
                    <option value="DESC">Terbaru </option>
                    <option value="ASC">Terlama</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <Select
                    placeholder="Berdasarkan Tujuan"
                    borderRadius={0}
                    onClick={(e) => selectHandler(e, "puskesmasId")}
                  >
                    {renderPuskesmas()}
                  </Select>
                </FormControl>{" "}
                <FormControl>
                  <Select
                    placeholder="Berdasarkan Jenis"
                    borderRadius={0}
                    onClick={(e) => selectHandler(e, "jenis")}
                  >
                    <option value="1">Amprahan </option>
                    <option value="2">Bon</option>
                    <option value="3">Program </option>
                    <option value="4">Alokasi</option>
                    <option value="5">Obat masuk </option>

                    <option value="6">Obat Exp </option>
                    <option value="7">Obat Rusak</option>
                    <option value="8">Stok Opname </option>
                  </Select>
                </FormControl>
              </SimpleGrid>
            </Container>
            <Container
              p={"15px"}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              maxW={"1280px"}
              mt={"20px"}
            >
              {renderRiwayat()}
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
            <Container
              p={"15px"}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              maxW={"1280px"}
              mt={"20px"}
              display={{ ss: "none", sl: "block" }}
            >
              <FormControl>
                <FormLabel>Tahun</FormLabel>
                <InputGroup>
                  <InputLeftAddon mt={"10px"}> 20</InputLeftAddon>
                  <Input
                    w={"60px"}
                    type="number"
                    mt={"10px"}
                    border="1px"
                    borderRadius={"5px"}
                    borderColor={"rgba(229, 231, 235, 1)"}
                    max={99}
                    onChange={(e) => {
                      setTahun(parseInt(e.target.value));
                    }}
                  />
                </InputGroup>
              </FormControl>
              <Text
                mb={"20px"}
                fontSize={"24px"}
                fontWeight={600}
                textAlign={"center"}
              >
                Chart Mutasi Barang per tahun {tahun ? 2000 + tahun : null}
              </Text>
              <DataChart dataStatistik={dataStatistik} />
              <Text
                mt={"100px"}
                fontSize={"24px"}
                fontWeight={600}
                textAlign={"center"}
              >
                Diagram Persebaran Obat per tahun {tahun ? 2000 + tahun : null}
              </Text>

              <Center>
                {" "}
                <PolarChart dataStatistik={dataStatistikTujuanObat} />
              </Center>
            </Container>
          </>
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
              <Text>Data Riwayat Obat kosong</Text>
            </Center>
          </Container>
        )}
      </Box>
      {selectedBatch && (
        <Modal
          closeOnOverlayClick={false}
          isOpen={isDetailOpen}
          onClose={() => {
            setSelectedBatch(null);
            onDetailClose();
          }}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0} maxW="800px">
            <ModalHeader>Detail Nomor Batch</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <SimpleGrid minChildWidth={"200px"}>
                <Box>
                  {selectedBatch?.pic ? (
                    <Image
                      src={
                        selectedBatch?.pic
                          ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                            selectedBatch.pic
                          : addFoto
                      }
                      alt="Batch Image"
                      width="400px"
                      height="300px"
                      objectFit="cover"
                    />
                  ) : null}
                </Box>
                <Box>
                  <Table variant="simple" size="sm">
                    <Tbody>
                      <Tr>
                        <Td>Nomor Batch</Td>
                        <Td>{selectedBatch?.noBatch}</Td>
                      </Tr>
                      <Tr>
                        <Td>Asal</Td>
                        <Td>{selectedBatch?.perusahaan?.nama}</Td>
                      </Tr>

                      {UserRoles.includes(2) ||
                      UserRoles.includes(7) ||
                      UserRoles.includes(8) ? (
                        <Tr>
                          <Td>Harga</Td>
                          <Td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(selectedBatch?.harga)}
                          </Td>
                        </Tr>
                      ) : null}

                      <Tr>
                        <Td>EXP</Td>
                        <Td>{formatDate(selectedBatch?.exp)}</Td>
                      </Tr>
                      <Tr
                        display={
                          UserRoles.includes(2) ||
                          UserRoles.includes(7) ||
                          UserRoles.includes(8)
                            ? "table-row"
                            : "none"
                        }
                      >
                        <Td>Stok</Td>
                        <Td>{selectedBatch?.stok}</Td>
                      </Tr>
                      <Tr
                        display={
                          UserRoles.includes(2) || UserRoles.includes(8)
                            ? "table-row"
                            : "none"
                        }
                      >
                        <Td>Kotak</Td>
                        <Td>
                          {`${Math.floor(
                            selectedBatch?.stok / selectedBatch?.kotak
                          )} kotak` +
                            (selectedBatch?.stok % selectedBatch?.kotak !== 0
                              ? ` dan ${
                                  selectedBatch?.stok % selectedBatch?.kotak
                                } ecer`
                              : "")}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Layout>
  );
}

export default DetailObat;
