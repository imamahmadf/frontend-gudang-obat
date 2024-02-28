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
import Layout from "../Components/Layout";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const changePage = ({ selected }) => {
    setPage(selected);
  };

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
        <Flex
          px={"30px"}
          py={"15px"}
          borderTop={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          key={idx}
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
                src={import.meta.env.VITE_REACT_APP_API_BASE_URL + val.pic}
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
                    <>
                      <Flex key={val2.noBatch} justifyContent={"flex-end"}>
                        <Box>
                          <Flex>
                            <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                              {val2.noBatch}
                            </Text>
                            <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                              {newExp}
                            </Text>{" "}
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
                    </>
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
              {" "}
              <TambahAmprahanItem userId={1} data={val.noBatches} id={val.id} />
              <Menu>
                <MenuButton p={0} h="25px" w="25px" fontSize="12px" as={Button}>
                  {" "}
                </MenuButton>
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
            </Flex>
          </Flex>
        </Flex>
      );
    });
  }

  useEffect(() => {
    fetchDataObat();
    //console.log(bank);
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
          >
            {" "}
            <Text>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(aset)}
            </Text>
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
                      >
                        Tambah Obat
                      </Button>
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
                colorScheme="red"
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
