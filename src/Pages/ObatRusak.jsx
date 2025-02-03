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
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import { BsChevronDoubleDown } from "react-icons/bs";
import addFoto from "./../assets/add_photo.png";
import Batik from "../assets/BATIK.png";
function ObatRusak() {
  const toast = useToast();
  const history = useHistory();
  const { profileId } = useSelector((state) => state.user);
  const [status, setStatus] = useState([]);
  const [dataObatRusak, setDataObatRusak] = useState([]);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [time, setTime] = useState("");

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const {
    isOpen: isRusakOpen,
    onOpen: onRusakOpen,
    onClose: onRusakClose,
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
  async function OpenObatRusak() {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rusak/post/open-rusak`,
        { profileId }
      )
      .then((res) => {
        history.push(`/gfk/daftar-obat`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function closeObatRusak() {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/rusak/post/close-rusak?id=${status.id}`
      )
      .then((res) => {
        toast({
          title: "Berhasil!",
          description: "Obat Rusak Berhasil Ditutup",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchObatRusak();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        // console.log(res.data[0], "STATUSSSS");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchObatRusak() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/rusak/get?page=${page}&limit=${limit}&time=${time}`
      )
      .then((res) => {
        // console.log(res.data);
        setDataObatRusak(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchStatus();
    fetchObatRusak();
  }, [page, time]);
  return (
    <>
      <Layout>
        <Box
          backgroundImage={`url(${Batik})`}
          bgColor={"secondary"}
          py={"50px"}
          mt={"50px"}
        >
          <Container
            mt={"30px"}
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            {status ? null : (
              <Button onClick={onRusakOpen}>tambah Obat Rusak</Button>
            )}
            {status?.StatusAmprahanId === 7 ? (
              <Button onClick={closeObatRusak}>Tutup Obat Rusak</Button>
            ) : null}
            <Table variant="simple" mt={4}>
              <Thead>
                <Tr>
                  <Th>Nama Obat</Th>
                  <Th>No Batch</Th>
                  <Th>Harga</Th>
                  <Th>Stok</Th>
                  <Th>EXP</Th>
                  <Th>Catatan</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataObatRusak?.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Flex>{item.noBatch?.obat.nama}</Flex>
                    </Td>
                    <Td>{item.noBatch?.noBatch}</Td>
                    <Td>{item.noBatch?.harga}</Td>
                    <Td>{item?.permintaan}</Td>
                    <Td>{formatDate(item.noBatch?.exp)}</Td>
                    <Td>{item?.catatan}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>{" "}
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
          isOpen={isRusakOpen}
          onClose={onRusakClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0}>
            <ModalHeader>Tambah Obat Rusak</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>Apakah Anda Yakin ingin menambahkan Obat Rusak?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"danger"}
                color={"white"}
                _hover={{
                  bg: "black",
                }}
                onClick={() => {
                  OpenObatRusak();
                }}
              >
                Tambah
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default ObatRusak;
