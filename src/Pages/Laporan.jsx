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
import { useDisclosure } from "@chakra-ui/react";
import Layout from "../Components/Layout";

function Laporan() {
  const today = new Date();
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
  const [kategoriId, setkategoriId] = useState(1);
  const [kategoriData, setkategoriData] = useState([]);
  const [dataLaporan, setDataLaporan] = useState([]);
  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "startDate") {
      setInputStartDate(value);
    } else if (field === "endDate") {
      setInputEndDate(value);
    }
  };

  async function fetchDataLaporan() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/laporan/get/${kategoriId}?startDate=${inputStartDate}&endDate=${inputEndDate}`
      )
      .then((res) => {
        console.log(res.data, "LAPORAN");
        setDataLaporan(res.data.result);
        setkategoriData(res.data.kategoriFE);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function renderKategori() {
    return kategoriData.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  function renderLaporan() {
    return (
      <Box style={{ overflowX: "auto" }}>
        <Table variant="simple" size="sm" mt={2}>
          <Thead bgColor={"primary"}>
            <Tr>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
                py={"20px"}
              >
                No.
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Nama Obat
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Satuan
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                <Text> Sisa pada</Text>
                <Text> {inputStartDate}</Text>
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                Penerimaan
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                Pengeluaran
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                Expired Date
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                <Text> Sisa pada</Text>
                <Text> {inputEndDate}</Text>
              </Th>
              <Th
                colSpan={4}
                borderWidth="1px"
                borderColor="white"
                textAlign="center"
                fontSize={"14px"}
                color={"white"}
              >
                Pemakaian
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Harga Satuan
              </Th>

              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Nilai Aset Penerimaan
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Nilai Aset Pemakaian
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                rowSpan={2}
                fontSize={"14px"}
                color={"white"}
              >
                Nilai Aset
              </Th>
            </Tr>
            <Tr>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                APBD
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Prog
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Buffer
              </Th>
              <Th
                borderWidth="1px"
                borderColor="white"
                fontSize={"14px"}
                color={"white"}
              >
                Total
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataLaporan?.map((val, idx) => {
              return (
                <Tr key={idx}>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {idx + 1}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.nama}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.satuan.nama}
                  </Td>
                  {/* ///////// */}
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1
                      ? val.totalStok +
                        val.pemakaian +
                        val.obatExp -
                        val.penerimaan
                      : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3
                      ? val.totalStok +
                        val.pemakaian +
                        val.obatExp -
                        val.penerimaan
                      : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2
                      ? val.totalStok +
                        val.pemakaian +
                        val.obatExp -
                        val.penerimaan
                      : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.totalStok +
                      val.pemakaian +
                      val.obatExp -
                      val.penerimaan}
                  </Td>
                  {/* ////////// */}

                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1 ? val.penerimaan : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3 ? val.penerimaan : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2 ? val.penerimaan : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.penerimaan}
                  </Td>
                  {/* ///////////// */}
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1 ? val.obatExp + val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3 ? val.obatExp + val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2 ? val.obatExp + val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.obatExp + val.pemakaian}
                  </Td>
                  {/* //////////// */}

                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1 ? val.obatExp : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3 ? val.obatExp : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2 ? val.obatExp : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.obatExp}
                  </Td>
                  {/* /////////// */}
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1 ? val.totalStok : "-"}
                  </Td>

                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3 ? val.totalStok : "-"}
                  </Td>

                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2 ? val.totalStok : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.totalStok}
                  </Td>
                  {/* //////// */}

                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 1 ? val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 3 ? val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.sumberDana.id == 2 ? val.pemakaian : "-"}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val.pemakaian}
                  </Td>
                  {/* //////// */}
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {val?.daftarHarga.map((harga) => {
                      return (
                        <>
                          <Text mb={"5px"}>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(harga)}
                            ,
                          </Text>
                        </>
                      );
                    })}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(val.totalAsetPenerimaan)}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(val.totalAsetPemakaian)}
                  </Td>
                  <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(val.totalAset)}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    );
  }
  useEffect(() => {
    fetchDataLaporan();
  }, [kategoriId, inputEndDate, inputEndDate]);
  return (
    <Layout>
      <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
        <Container
          mt={"30px"}
          maxW={"4280px"}
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
          <FormControl mt={"20px"}>
            <FormLabel>Pilih Kategori</FormLabel>
            <Select
              mt="5px"
              placeholder="Kategori"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onClick={(e) => setkategoriId(e.target.value)}
            >
              {renderKategori()}
            </Select>
          </FormControl>
          {renderLaporan()}
        </Container>
      </Box>
    </Layout>
  );
}

export default Laporan;
