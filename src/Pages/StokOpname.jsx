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
import { useDisclosure } from "@chakra-ui/react";
import FotoHome from "../assets/GFK.jpeg";
import axios from "axios";
import Layout from "../Components/Layout";
import ExcelJS from "exceljs";

function StokOpname() {
  const [profile, setProfile] = useState([]);

  const [Penanggungjawab, setPenanggungjawab] = useState(0);
  const [dataStokOpname, setDataStokOpname] = useState([]);

  const {
    isOpen: isTutupSOOpen,
    onOpen: onTutupSOOpen,
    onClose: onTutupSOClose,
  } = useDisclosure();

  function renderProfile() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama} {val.id}
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
        console.log(res.data, "DATA API STOK OPNAME");
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
    console.log(Penanggungjawab);
  }, [Penanggungjawab]);

  async function tutupSO() {
    // Menyaring data untuk mendapatkan hanya yang memiliki status noBatch = 2
    const filteredData = dataStokOpname
      .map((item) => {
        const filteredBatches = item.noBatches.filter(
          (batch) => batch.status === 2
        );
        return {
          nama: item.nama,
          totalStok: item.totalStok,
          noBatches: filteredBatches.map((batch) => batch.id),
        };
      })
      .filter((item) => item.noBatches.length > 0); // Hanya ambil item yang memiliki noBatches
    console.log(filteredData, "FILER DATAAA!!!!");
    // Mengirim data ke API
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/stok-opname/post/tutup-so`,
        filteredData
      )
      .then((response) => {
        console.log("Data berhasil dikirim:", response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengirim data:", error);
      });
  }

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stok Opname");

    // Menambahkan header
    worksheet.columns = [
      { header: "Nama Obat", key: "namaObat", width: 30 },
      { header: "No Batch", key: "noBatch", width: 20 },
      { header: "Exp", key: "exp", width: 20 },
      { header: "Stok", key: "stok", width: 15 },
      { header: "Total Stok", key: "totalStok", width: 15 },
    ];

    // Menambahkan border untuk header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.font = { bold: true }; // Membuat header menjadi tebal
    });

    let currentRow = 2; // Mulai dari baris kedua
    dataStokOpname.forEach((item) => {
      if (item.noBatches.length > 0) {
        const totalStok = item.totalStok; // Ambil total stok untuk nama obat
        item.noBatches.forEach((batch, index) => {
          const rowData = {
            namaObat: index === 0 ? item.nama : "", // Hanya isi nama obat di baris pertama
            noBatch: batch.noBatch,
            exp: formatDate(batch.exp),
            stok: "", // Mengisi stok untuk setiap batch
            totalStok: "", // Hanya isi total stok di baris pertama
          };
          worksheet.addRow(rowData);
        });

        // Menggabungkan sel Nama Obat
        const lastRow = worksheet.lastRow.number; // Ambil nomor baris terakhir
        worksheet.mergeCells(currentRow, 1, lastRow, 1); // Menggabungkan sel dari currentRow ke lastRow di kolom 1 (Nama Obat)

        // Menggabungkan sel Total Stok
        worksheet.mergeCells(currentRow, 5, lastRow, 5); // Menggabungkan sel dari currentRow ke lastRow di kolom 5 (Total Stok)

        currentRow = lastRow + 1; // Update currentRow untuk baris berikutnya
      }
    });

    // Menambahkan border untuk semua sel
    for (let rowIndex = 1; rowIndex <= worksheet.lastRow.number; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      for (let cellIndex = 1; cellIndex <= row.cellCount; cellIndex++) {
        const cell = row.getCell(cellIndex);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    // Menyimpan file
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
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
          <Container
            maxW={"1280px"}
            p={"30px"}
            bgColor={"white"}
            borderRadius={"5px"}
          >
            <Button onClick={exportToExcel} colorScheme="teal" mb={4}>
              Ekspor ke Excel
            </Button>

            <Button onClick={onTutupSOOpen}>TUTUP SO</Button>
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

            {/* Tabel untuk menampilkan dataStokOpname menggunakan Chakra UI */}
            <Box mt="20px">
              <Table variant="simple" width="100%">
                <Thead>
                  <Tr>
                    <Th>Nama Obat</Th>
                    <Th>No Batch</Th>
                    <Th>Exp</Th>
                    <Th>Stok</Th>
                    <Th>Total Stok</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataStokOpname.map((item) => {
                    const batches = item.noBatches.filter(
                      (batch) => batch.status === 1
                    );
                    return batches.length > 0 ? (
                      <>
                        <Tr key={item.nama}>
                          <Td
                            rowSpan={batches.length}
                            borderWidth="1px"
                            borderColor="gray.200"
                          >
                            {item.nama}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {batches[0].noBatch}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {new Date(batches[0].exp).toLocaleDateString()}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {batches[0].stok}
                          </Td>
                          <Td
                            rowSpan={batches.length}
                            borderWidth="1px"
                            borderColor="gray.200"
                          >
                            {item.totalStok}
                          </Td>
                        </Tr>
                        {batches.slice(1).map((batch) => (
                          <Tr key={batch.noBatch}>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {batch.noBatch}
                            </Td>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {new Date(batch.exp).toLocaleDateString()}
                            </Td>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {batch.stok}
                            </Td>
                          </Tr>
                        ))}
                      </>
                    ) : null;
                  })}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>

        <Modal
          closeOnOverlayClick={false}
          isOpen={isTutupSOOpen}
          onClose={onTutupSOClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0}>
            <ModalHeader>Selesaikan SO</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>Apakah Anda Yakin ingin menutup SO?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                height={"20px"}
                width={"60px"}
                fontSize={"12px"}
                onClick={tutupSO}
              >
                Terima
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default StokOpname;
