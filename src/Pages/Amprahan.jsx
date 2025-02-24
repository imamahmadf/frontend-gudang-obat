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
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import TambahAmprahan from "../Components/TambahAprahan";
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
  const [limit, setLimit] = useState(20);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");
  const [status, setStatus] = useState([]);
  const [jenis, setJenis] = useState(1);
  const { UserRoles } = useSelector((state) => state.user);

  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        // console.log(res.data, "STATUSSSS");
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
        // console.log(res.data.result);
        setAllAmprahan(res.data.result.rows);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      })
      .catch((err) => {
        // console.log(err);
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
        <>
          <Tbody>
            <Tr>
              <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                {val.uptd.nama}
              </Td>
              <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                {newTanggal}
              </Td>
              <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                {val.isOpen == 1 ? "Aktif" : "Selesai"}
              </Td>
              <Td borderWidth="1px" borderColor="primary" py={"15px"}>
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
              </Td>
            </Tr>
          </Tbody>
        </>
      );
    });
  }

  function renderHalaman() {
    return (
      <>
        <Box style={{ overflowX: "auto" }}>
          <Table variant="simple" size="sm" mt={2}>
            <Thead bgColor={"primary"}>
              <Tr>
                <Th
                  fontSize={"14px"}
                  borderColor={"white"}
                  color={"white"}
                  py={"15px"}
                >
                  Tujuan
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"white"}
                  color={"white"}
                  py={"15px"}
                >
                  Tanggal
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"white"}
                  color={"white"}
                  py={"15px"}
                >
                  Status
                </Th>
                <Th
                  fontSize={"14px"}
                  borderColor={"white"}
                  color={"white"}
                  py={"15px"}
                >
                  Aksi
                </Th>
              </Tr>
            </Thead>
            {renderAmrahan()}
          </Table>
        </Box>
      </>
    );
  }
  const isAnyOpen = allAmprahan.some((val) => val.isOpen === 1);
  useEffect(() => {
    fetchAllAmprahan();
    fetchStatus();
    // console.log(isAnyOpen);
  }, [page, jenis]);

  const handleTabClick = (val) => {
    setJenis(val);
    // console.log(val, "JENISSS");
  };

  return (
    <Layout>
      <Box
        pt={"80px"}
        bgColor={"rgba(249, 250, 251, 1)"}
        backgroundImage={`url(${Batik})`}
        pb={"40px"}
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
          {UserRoles.includes(7) || UserRoles.includes(8) ? (
            status?.isOpen ? null : (
              <TambahAmprahan />
            )
          ) : null}
          <Box style={{ overflowX: "auto" }}>
            <Tabs
              isFitted
              variant="soft-rounded"
              colorScheme="green"
              mt={"20px"}
            >
              <TabList>
                <Tab onClick={() => handleTabClick(1)}>Amprahan</Tab>
                <Tab onClick={() => handleTabClick(2)}>bon</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>{renderHalaman()}</TabPanel>
                <TabPanel>{renderHalaman()}</TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
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
