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
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import Batik from "../assets/BATIK.png";
function ObatUser(props) {
  const today = new Date();
  const [dataObatUser, setDataObatUser] = useState([]);
  const [inputStartDate, setInputStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [inputEndDate, setInputEndDate] = useState(
    new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0]
  );
  const [namaPuskesmas, setNamaPuskesmas] = useState([]);
  const [puskesmasId, setPuskesmasId] = useState(null);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

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
    return `${hari}-${bulan}-${tahun}`;
  }
  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "puskesmasId") {
      setPuskesmasId(value);
      // console.log(value);
    }
  }
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "startDate") {
      setInputStartDate(value);
    } else if (field === "endDate") {
      setInputEndDate(value);
    }
  };
  async function fetchNamaPuskesmas() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas`)
      .then((res) => {
        setNamaPuskesmas(res.data.result);
        // console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  function renderPuskesmas() {
    // console.log(puskesmas);
    return namaPuskesmas?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  async function fetchDataObat() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/get/obat-profile/${
          props?.match?.params?.profileId
        }?startDate=${inputStartDate}&endDate=${inputEndDate}&puskesmasId=${puskesmasId}`
      )
      .then((res) => {
        console.log(res.data, "INI DATA DARI OBAT USER");
        setDataObatUser(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function renderDaftarAmprahan() {
    return (
      <Box style={{ overflowX: "auto" }}>
        <Table variant="simple" size="sm" mt={2}>
          <Thead bgColor={"primary"}>
            <Tr>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
                py={"20px"}
              >
                Tanggal
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Tujuan
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                No.
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Nama Obat
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Satuan
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                No Batch
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                EXp
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Jumlah
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Keterangan
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataObatUser.map((amprahan) => {
              return amprahan.amprahanItems.map((val, idx) => {
                return (
                  <Tr key={idx}>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {formatTanggal(amprahan.tanggal)}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {amprahan.uptd.nama}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {idx + 1}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {val.noBatch.obat.nama}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {val.noBatch.obat.satuan.nama}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {val.noBatch.noBatch}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {formatDate(val.noBatch.exp)}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {val.permintaan}
                    </Td>
                    <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                      {amprahan.StatusAmprahan.nama}
                    </Td>
                  </Tr>
                );
              });
            })}
          </Tbody>
        </Table>
      </Box>
    );
  }

  // useEffect(() => {
  //   const today = new Date();
  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  //   const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  //   setInputStartDate(startOfMonth.toISOString().split("T")[0]); // Format YYYY-MM-DD
  //   setInputEndDate(endOfMonth.toISOString().split("T")[0]); // Format YYYY-MM-DD

  //   fetchNamaPuskesmas();
  //   fetchDataObat();
  // }, []);

  useEffect(() => {
    fetchNamaPuskesmas();
    fetchDataObat();
  }, [inputStartDate, inputEndDate, puskesmasId]);

  return (
    <Box>
      <Layout>
        <Box
          backgroundImage={`url(${Batik})`}
          bgColor={"secondary"}
          py={"50px"}
          mt={"50px"}
        >
          <Container
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <Flex>
              <FormControl border={"1px"} borderColor="gray.400" me="5px">
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
                  defaultValue={inputEndDate}
                  type="date"
                  border={"none"}
                  onChange={(e) => handleChange(e, "endDate")}
                />
              </FormControl>
            </Flex>
            <FormControl>
              <Select
                mb="20px"
                placeholder="Berdasarkan Tujuan"
                borderRadius={0}
                onClick={(e) => selectHandler(e, "puskesmasId")}
              >
                {renderPuskesmas()}
              </Select>
            </FormControl>
            {renderDaftarAmprahan()}
          </Container>
        </Box>
      </Layout>
    </Box>
  );
}

export default ObatUser;
