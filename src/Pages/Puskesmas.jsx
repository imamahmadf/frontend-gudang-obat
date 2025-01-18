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
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "../Components/Layout";
import addFoto from "./../assets/add_photo.png";
import "../Style/pagination.css";
import ReactPaginate from "react-paginate";

function Puskesmas() {
  const today = new Date();
  const [puskesmas, setPuskesmas] = useState([]);
  const [puskesmasId, setPuskesmasId] = useState(0);
  const [profile, setProfile] = useState([]);
  const [penanggungJawabProfile, setPenanggungjawabProfile] = useState(0);

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

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [dataPuskesmas, setDataPuskesmas] = useState([]);

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

  async function fetchProfile() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-profile`)
      .then((res) => {
        console.log(res.data.result);
        setProfile(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function renderProfile() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  async function fetchNamaPuskesmas() {
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

  async function fetchDataPuskesmas() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/puskesmas/get/${puskesmasId}?startDate=${inputStartDate}&endDate=${inputEndDate}&profileId=${penanggungJawabProfile}`
      )
      .then((res) => {
        console.log(res.data);
        setDataPuskesmas(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "puskesmasId") {
      setPuskesmasId(value);
      // console.log(value);
    }
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

  function renderDataPuskesmas() {
    return dataPuskesmas.map((item) => (
      <Tr key={item.id}>
        <Td>{item.items[0].amprahan.tanggal}</Td>
        <Td>{item.nama}</Td>
        <Td>{item.items[0].noBatch.noBatch}</Td>
        <Td>{item.items[0].permintaan}</Td>
        <Td>{item.items[0].amprahan.StatusAmprahan.nama}</Td>
        <Td>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.items[0].permintaan * item.items[0].noBatch.harga)}
        </Td>
      </Tr>
    ));
  }

  useEffect(() => {
    fetchNamaPuskesmas();
    fetchProfile();
    fetchDataPuskesmas();
  }, [inputStartDate, inputEndDate, puskesmasId, penanggungJawabProfile]);
  return (
    <Layout>
      <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
        <Container
          mt={"30px"}
          maxW={"1280px"}
          bgColor={"white"}
          borderRadius={"5px"}
          p={"30px"}
        >
          {" "}
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
          <FormControl>
            <Select
              placeholder="Penanggungjawab"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : 0;
                setPenanggungjawabProfile(value);
              }}
            >
              {renderProfile()}
            </Select>
          </FormControl>{" "}
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
          </Flex>{" "}
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tanggal Dibuat</Th>
                <Th>Nama Obat</Th>
                <Th>No. Batch</Th>
                <Th>Permintaan</Th>

                <Th>jenis</Th>
                <Th>Nilai Aset</Th>
              </Tr>
            </Thead>
            <Tbody>{renderDataPuskesmas()}</Tbody>
          </Table>
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
    </Layout>
  );
}

export default Puskesmas;
