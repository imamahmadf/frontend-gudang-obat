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
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import addFoto from "./../assets/add_photo.png";
import Layout from "../Components/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
function DetailObat(props) {
  const [dataObat, setDataObat] = useState([]);
  const [dataAmprahan, setDataAmprahan] = useState([]);
  const history = useHistory();
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [time, setTime] = useState("");
  const [puskesmas, setPuskesmas] = useState([]);
  const [puskesmasId, setPuskesmasId] = useState(0);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();

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
    return dataAmprahan?.map((val, idx) => {
      const newExp = formatTanggal(val.amprahan.tanggal);
      // console.log(val, idx, "tes index di detail OBAT");

      let sisaStok = 0;
      let arraySisaStok = [];

      for (let i = 0; i <= idx; i++) {
        if (dataAmprahan[i].amprahan.uptd.status == 1) {
          sisaStok -= dataAmprahan[i].permintaan;
          arraySisaStok.push(sisaStok);
        } else {
          sisaStok += dataAmprahan[i].permintaan;
          arraySisaStok.push(sisaStok);
        }
      }

      return (
        <Flex
          key={`${val.id}-${idx}`}
          py={"10px"}
          borderBottom={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          backgroundColor={idx % 2 === 0 ? "white" : "rgba(229, 231, 235, 1)"}
        >
          <Text mx={"15px"} minW={"110px"}>
            {newExp}
          </Text>
          <Text me={"15px"} minW={"110px"}>
            {val.noBatch.noBatch}
          </Text>
          <Text me={"15px"} minW={"150px"}>
            {val.amprahan.uptd.nama}
          </Text>
          <Text me={"15px"} minW={"100px"}>
            {val.amprahan.uptd.statusTujuanId == 2 ? val.permintaan : "-"}
          </Text>
          <Text me={"15px"} minW={"100px"}>
            {val.amprahan.uptd.statusTujuanId == 1 ? val.permintaan : "-"}
          </Text>
          <Text me={"15px"} minW={"100px"}>
            {val.sisa}
          </Text>
          <Text me={"15px"} minW={"100px"}>
            {val.amprahan.StatusAmprahan.nama}
          </Text>
        </Flex>
      );
    });
  }

  async function fetchObat() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/detail/${
          props.match.params.obatId
        }?page=${page}&limit=${limit}&startDate=${inputStartDate}&endDate=${inputEndDate}&puskesmasId=${puskesmasId}&time=${time}`
      )
      .then((res) => {
        setDataObat(res.data.result);
        setDataAmprahan(res.data.amprahanData.rows);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchObat();
    fetchDataPuskesmas();
  }, [page, inputStartDate, inputEndDate, time, puskesmasId]);

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
        <Container
          p={"15px"}
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
        >
          <Box>
            <Text fontSize={"20px"} fontWeight={600}>
              Nama Obat: {dataObat?.nama}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              Satuan: {dataObat?.satuan?.nama}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              Kelas Terapi: {dataObat?.kelasterapi?.nama}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              Kategori: {dataObat?.kategori?.nama}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              Tanggal Input: {formatTanggal(dataObat?.createdAt)}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              Kategori: {dataObat?.kategori?.nama}
            </Text>
          </Box>
          <Flex>
            <Box>
              {" "}
              <Image
                borderRadius={"5px"}
                alt="property image"
                width="600px"
                height="600px"
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
            </Box>
            <Box ms={"20px"}>
              <Table variant="simple" size="sm" mt={2}>
                <Thead>
                  <Tr>
                    <Th fontSize={"14px"}>Nomor Batch</Th>
                    <Th fontSize={"14px"}>EXP</Th>
                    <Th fontSize={"14px"}>Harga Satuan</Th>
                    <Th fontSize={"14px"} isNumeric>
                      Stok
                    </Th>

                    <Th fontSize={"14px"} isNumeric>
                      detail
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataObat?.noBatches?.map((val) => {
                    const newExp = formatDate(val.exp);
                    return (
                      <Tr key={val.noBatch}>
                        <Td fontSize={"14px"} maxWidth="100px">
                          {val.noBatch}
                        </Td>
                        <Td fontSize={"14px"} maxWidth="130px">
                          {newExp}
                        </Td>
                        <Td fontSize={"14px"} maxWidth="130px">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(val.harga)}
                        </Td>
                        <Td fontSize={"14px"} isNumeric maxWidth="130px">
                          {val.stok}
                        </Td>

                        <Td>
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
                <Tfoot>
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
          </Flex>
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
          <Flex>
            <FormControl border={"1px"} borderColor="gray.400" me="5px">
              <Text ms="18px">Start Date</Text>
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
              <Text ms="18px">End Date</Text>
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
          <FormControl>
            <Select
              mb="20px"
              placeholder="short by Income"
              borderRadius={0}
              onClick={(e) => selectHandler(e, "puskesmasId")}
            >
              {renderPuskesmas()}
            </Select>
            <Select
              placeholder="short by date"
              borderRadius={0}
              onClick={(e) => selectHandler(e, "time")}
            >
              <option value="DESC">Newest </option>
              <option value="ASC">Latest</option>
            </Select>
          </FormControl>{" "}
          <Flex
            backgroundColor={"primary"}
            color={"white"}
            py={"10px"}
            borderBottom={"1px"}
            borderTop={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
          >
            <Text mx={"15px"} minW={"110px"}>
              Tanggal
            </Text>
            <Text me={"15px"} minW={"110px"}>
              Nomor Batch
            </Text>
            <Text me={"15px"} minW={"150px"}>
              Tujuan
            </Text>
            <Text me={"15px"} minW={"100px"}>
              Masuk
            </Text>
            <Text me={"15px"} minW={"100px"}>
              Keluar
            </Text>
            <Text me={"15px"} minW={"100px"}>
              Sisa Stok
            </Text>
            <Text me={"15px"} minW={"100px"}>
              Jenis
            </Text>
          </Flex>
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
              {" "}
              <Flex>
                <Image
                  src={
                    selectedBatch.pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        selectedBatch.pic
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
                      <Td>Nomor Batch</Td>
                      <Td>{selectedBatch.noBatch}</Td>
                    </Tr>
                    <Tr>
                      <Td>Asal</Td>
                      <Td>{selectedBatch.perusahaan.nama}</Td>
                    </Tr>
                    <Tr>
                      <Td>Sumber Dana</Td>
                      <Td>{selectedBatch.sumberDana?.sumber}</Td>
                    </Tr>
                    <Tr>
                      <Td>Harga</Td>
                      <Td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(selectedBatch.harga)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>EXP</Td>
                      <Td>{formatDate(selectedBatch.exp)}</Td>
                    </Tr>
                    <Tr>
                      <Td>Stok</Td>
                      <Td>{selectedBatch.stok}</Td>
                    </Tr>
                    <Tr>
                      <Td>Kotak</Td>
                      <Td>
                        {" "}
                        {`${Math.floor(
                          selectedBatch.stok / selectedBatch.kotak
                        )} kotak` +
                          (selectedBatch.stok % selectedBatch.kotak !== 0
                            ? ` dan ${
                                selectedBatch.stok % selectedBatch.kotak
                              } ecer`
                            : "")}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Flex>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Layout>
  );
}

export default DetailObat;
