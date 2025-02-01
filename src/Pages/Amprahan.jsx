import React, { useEffect, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import {
  Box,
  Container,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import TambahAprahan from "../Components/TambahAprahan";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import Layout from "../Components/Layout";
import Batik from "../assets/BATIK.png";

function Amprahan() {
  const history = useHistory();
  const [allAmprahan, setAllAmprahan] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [status, setStatus] = useState([]);
  const [jenis, setJenis] = useState(1);

  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        console.log(res.data, "STATUSSSS");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  async function fetchAllAmprahan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/get/all-amprahan?&time=${time}&page=${page}&jenis=${jenis}&limit=${limit}`
      )
      .then((res) => {
        console.log(res.data.result);
        setAllAmprahan(res.data.result.rows);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      })
      .catch((err) => {
        console.log(err);
      });
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
  function renderAmrahan() {
    return allAmprahan.map((val, idx) => {
      const newTanggal = formatTanggal(val.tanggal);
      return (
        <Center key={val.id} flexDirection={"column"}>
          <Flex
            my={"10px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
          >
            <Text fontSize={"15px"} width={"130px"} me={"10px"}>
              {val.uptd.nama}
            </Text>
            <Text fontSize={"15px"} width={"110px"} me={"10px"}>
              {newTanggal}
            </Text>{" "}
            <Text fontSize={"15px"} width={"80px"} me={"10px"}>
              {val.isOpen == 1 ? "Aktif" : "Selesai"}
            </Text>{" "}
            <Box width={"80px"}>
              <Center
                onClick={() => {
                  history.push(`amprahan/${val.id}`);
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
                <BsCart4 />
              </Center>
            </Box>
          </Flex>
        </Center>
      );
    });
  }

  function renderHalaman() {
    return (
      <>
        <Center
          borderTop={"1px"}
          borderBottom={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          p={"10px"}
        >
          <Text fontSize={"15px"} fontWeight={600} width={"130px"} me={"10px"}>
            Puskesmas
          </Text>
          <Text fontSize={"15px"} fontWeight={600} width={"110px"} me={"10px"}>
            Tanggal
          </Text>{" "}
          <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
            Status
          </Text>{" "}
          <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
            Aksi
          </Text>{" "}
        </Center>
        <Center flexDirection={"column"}>{renderAmrahan()}</Center>
      </>
    );
  }
  const isAnyOpen = allAmprahan.some((val) => val.isOpen === 1);
  useEffect(() => {
    fetchAllAmprahan();
    fetchStatus();
    console.log(isAnyOpen);
  }, [page, jenis]);

  const handleTabClick = (val) => {
    setJenis(val);
    console.log(val, "JENISSS");
  };

  return (
    <Layout>
      <Box
        pt={"80px"}
        bgColor={"rgba(249, 250, 251, 1)"}
        backgroundImage={`url(${Batik})`}
      >
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          {/* <TambahAprahan /> */}
          {status?.isOpen ? null : <TambahAprahan />}
          {JSON.stringify(status?.isOpen)}
          <Tabs variant="enclosed">
            <TabList>
              <Tab onClick={() => handleTabClick(1)}>Amprahan</Tab>
              <Tab onClick={() => handleTabClick(2)}>bon</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>{renderHalaman()}</TabPanel>
              <TabPanel>{renderHalaman()}</TabPanel>
            </TabPanels>
          </Tabs>
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

export default Amprahan;
