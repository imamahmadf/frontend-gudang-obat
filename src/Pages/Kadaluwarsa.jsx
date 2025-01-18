import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  ModalCloseButton,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { BsChevronDoubleDown } from "react-icons/bs";
import "../Style/pagination.css";
import { useDisclosure } from "@chakra-ui/react";
import { BsTrash3 } from "react-icons/bs";
import addFoto from "./../assets/add_photo.png";
import { useDispatch, useSelector } from "react-redux";
function Kadaluwarsa() {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedBatchDetail, setSelectedBatchDetail] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [alfabet, setAlfabet] = useState("");
  const [time, setTime] = useState("");
  const [dataObat, setDataObat] = useState([]);
  const { UserRoles, profileId } = useSelector((state) => state.user);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  async function fetchDataObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/kadaluwarsa/get/kadaluwarsa?search_query=${keyword}&alfabet=${alfabet}&time=${time}&page=${page}&limit=${limit}`
      )
      .then((res) => {
        setDataObat(res.data.result.rows);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function hapusObat() {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/kadaluwarsa`,
        {
          obatId: selectedBatch.id,
          stokEXP: selectedBatchDetail.stok,
          perusahaanId: selectedBatchDetail.perusahaanId,
          noBatchId: selectedBatchDetail.id,
          userId: 1,
        }
      )
      .then((res) => {
        fetchDataObat();
        setSelectedBatch(null);
        onDetailClose();
        setSelectedBatchDetail(null);
        console.log(res);
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

  function inputHandler(event) {
    const tes = setTimeout(() => {
      //console.log(event.target.value);
      const { value } = event.target;

      setKeyword(value);
    }, 2000);
  }
  useEffect(() => {
    fetchDataObat();
    console.log(dataObat, "CEK KADALUWARSA");
  }, [keyword, page]);
  return (
    <>
      <Layout>
        <Box
          overflow="hidden"
          objectFit="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          minHeight={"100vh"}
          w="100%"
        >
          <Container pt={"100px"} maxW={"1280px"}>
            <Button
              onClick={() => {
                history.push(`/gfk/daftar-kadaluwarsa`);
              }}
            >
              Daftar Kadaluwarsa
            </Button>
            <Box>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Nama Obat</Th>
                    <Th>Exp</Th>
                    <Th>No Batch</Th>
                    <Th>Stok</Th>
                    {UserRoles.includes(6) ||
                    UserRoles.includes(8) ||
                    UserRoles.includes(7) ? (
                      <Th>Hapus</Th>
                    ) : null}
                  </Tr>
                </Thead>
                <Tbody>
                  {dataObat?.map((obat) =>
                    obat.noBatches
                      .filter((batch) => batch.stok > 0)
                      .map((batch) => (
                        <Tr key={batch.id}>
                          <Td>{obat.nama}</Td>
                          <Td>{batch.exp ? formatDate(batch.exp) : "N/A"}</Td>
                          <Td>{batch.noBatch || "N/A"}</Td>
                          <Td>{batch.stok || "N/A"}</Td>
                          {UserRoles.includes(6) ||
                          UserRoles.includes(8) ||
                          UserRoles.includes(7) ? (
                            <Td>
                              <Center
                                onClick={() => {
                                  setSelectedBatch(obat);
                                  setSelectedBatchDetail(batch);
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
                                bg="danger"
                              >
                                <BsTrash3 />
                              </Center>
                            </Td>
                          ) : null}
                        </Tr>
                      ))
                  )}
                </Tbody>
              </Table>
            </Box>
            {/* <div
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
            </div> */}
          </Container>
        </Box>{" "}
        {selectedBatch && selectedBatchDetail && (
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
                {" "}
                <Flex>
                  <Image
                    src={
                      selectedBatchDetail.pic
                        ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                          selectedBatchDetail.pic
                        : addFoto
                    }
                    alt="Batch Image"
                    width="300px"
                    height="300px"
                    objectFit="cover"
                  />
                  <Table variant="simple" size="sm">
                    <Tbody>
                      <Tr>
                        <Td>Nama obat</Td>
                        <Td>{selectedBatch.nama}</Td>
                      </Tr>
                      <Tr>
                        <Td>No. Batch</Td>
                        <Td>{selectedBatchDetail.noBatch}</Td>
                      </Tr>
                      <Tr>
                        <Td>Exp</Td>
                        <Td>{formatDate(selectedBatchDetail.exp)}</Td>
                      </Tr>
                      <Tr>
                        <Td>Asal</Td>
                        <Td>{selectedBatchDetail.perusahaan.nama}</Td>
                      </Tr>
                      <Tr>
                        <Td>Stok</Td>
                        <Td>{selectedBatchDetail.stok}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    hapusObat();
                  }}
                >
                  <BsTrash3 style={{ marginRight: "5px" }} /> hapus
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Layout>
    </>
  );
}

export default Kadaluwarsa;
