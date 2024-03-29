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
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../Components/Layout";
import ReactPaginate from "react-paginate";
import "../Style/pagination.css";
import { BsCaretRightFill } from "react-icons/bs";
import { BsCaretLeftFill } from "react-icons/bs";
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

  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "puskesmasId") {
      setPuskesmasId(value);
      console.log(value);
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
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function renderPuskesmas() {
    console.log(puskesmas);
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
      console.log(val, idx, "tes index di detail OBAT");

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
        <>
          <Flex
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
              {val.amprahan.uptd.status == 2 ? val.permintaan : "-"}
            </Text>
            <Text me={"15px"} minW={"100px"}>
              {val.amprahan.uptd.status == 1 ? val.permintaan : "-"}
            </Text>

            <Text me={"15px"} minW={"100px"}>
              {/* {arraySisaStok[idx]} */}
              {val.sisa}
              {/* {idx === 0 ? val.permintaan : val.amprahan.uptd.status == 1 ? val.permintaan[idx - 1] - val.permintaan : val.permintaan[idx - 1] + val.permintaan} */}
            </Text>
          </Flex>
        </>
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
          <Flex>
            <Image
              borderRadius={"5px"}
              alt="property image"
              width="600px"
              height="400px"
              me="10px"
              overflow="hiden"
              objectFit="cover"
              src={import.meta.env.VITE_REACT_APP_API_BASE_URL + dataObat?.pic}
            />
            <Box>
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
              </Box>
              <Flex justifyContent={"flex-end"}>
                <Box>
                  <Flex>
                    <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                      Nomor Batch
                    </Text>
                    <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                      EXP
                    </Text>{" "}
                    <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                      Harga Satuan
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
                    Stok
                  </Text>
                </Flex>
              </Flex>
              <Box>
                {dataObat?.noBatches?.map((val, idx) => {
                  const newExp = formatDate(val.exp);
                  return (
                    <>
                      <Flex key={val.noBatch} justifyContent={"flex-end"}>
                        <Box>
                          <Flex>
                            <Text fontSize={"13px"} width={"80px"} me={"10px"}>
                              {val.noBatch}
                            </Text>
                            <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                              {newExp}
                            </Text>{" "}
                            <Text fontSize={"13px"} width={"100px"} me={"10px"}>
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(val.harga)}
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
                            {val.stok}
                          </Text>
                        </Flex>
                      </Flex>
                    </>
                  );
                })}
                <Text fontSize={"13px"} fontWeight={600} mb={"50px"}>
                  jumlah Stok:{" "}
                  {dataObat?.noBatches?.reduce(
                    (total, batch) => total + batch.stok,
                    0
                  )}
                </Text>
              </Box>
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
            backgroundColor={"blue"}
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
    </Layout>
  );
}

export default DetailObat;
