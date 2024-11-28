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
  FormControl,
  Input,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import FotoHome from "../assets/GFK.jpeg";
import axios from "axios";
import Layout from "../Components/Layout";
import ExcelJS from "exceljs";

function StokOpname() {
  const [profile, setProfile] = useState([]);

  const [Penanggungjawab, setPenanggungjawab] = useState(0);
  const [dataStokOpname, setDataStokOpname] = useState([]);
  function renderProfile() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  async function fetchDataStokOpname() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/stok-opname/get/${Penanggungjawab}`
      )
      .then((res) => {
        console.log(res.data);
        setDataStokOpname(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

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

  useEffect(() => {
    fetchProfile();
    fetchDataStokOpname();
  }, [Penanggungjawab]);

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();

    // Mengambil file dari folder public
    const response = await fetch("/STOK_OPNAME.xlsx");
    const arrayBuffer = await response.arrayBuffer();

    // Membaca file dari array buffer
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);

    let rowIndex = 2; // Misalkan baris pertama adalah header
    dataStokOpname.forEach((item) => {
      // Mengisi nama, noBatch, dan exp dalam satu baris
      if (item.noBatches.length > 0) {
        const firstBatch = item.noBatches[0];
        worksheet.getCell(`A${rowIndex + 8}`).value = item.nama; // Mengisi nama
        worksheet.getCell(`B${rowIndex + 8}`).value = firstBatch.noBatch; // Mengisi noBatch
        worksheet.getCell(`C${rowIndex + 8}`).value = formatDate(
          firstBatch.exp
        ); // Mengisi exp
        rowIndex++;
      }

      // Mengisi noBatch dan exp untuk batch lainnya
      item.noBatches.slice(1).forEach((batch) => {
        worksheet.getCell(`A${rowIndex + 8}`).value = ""; // Kosongkan nama untuk baris berikutnya
        worksheet.getCell(`B${rowIndex + 8}`).value = batch.noBatch; // Mengisi noBatch
        worksheet.getCell(`C${rowIndex + 8}`).value = formatDate(batch.exp); // Mengisi exp
        rowIndex++;
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Data_Stok_Opname.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  return (
    <>
      <Layout>
        <Box
          // backgroundImage={FotoStokOpname}
          overflow="hiden"
          objectFit="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          height={"100vh"}
          w="100%"
        >
          <Container pt={"300px"} height={"1000px"} maxW={"1280px"}>
            <Button onClick={exportToExcel} colorScheme="teal" mb={4}>
              Ekspor ke Excel
            </Button>
            <Box minWidth={"600px"}>
              <FormLabel>Penanggungjawab</FormLabel>
              <Select
                mt="10px"
                placeholder="Penanggungjawab"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  setPenanggungjawab(parseInt(e.target.value));
                }}
              >
                {renderProfile()}
              </Select>
            </Box>
            <Text>INI StokOpname</Text>
            {/* Tabel untuk menampilkan dataStokOpname menggunakan Chakra UI */}
            <Box mt="20px">
              <Table variant="simple" width="100%">
                <Thead>
                  <Tr>
                    <Th>Nama Obat</Th>
                    <Th>No Batch</Th>
                    <Th>Exp</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataStokOpname.map((item, idx) =>
                    item.noBatches.map((batch) => (
                      <Tr key={batch.noBatch}>
                        <Td>{item.nama}</Td>
                        <Td>{batch.noBatch}</Td>
                        <Td>{new Date(batch.exp).toLocaleDateString()}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default StokOpname;
