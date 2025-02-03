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
  HStack,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Batik from "../assets/BATIK.png";
import { BsFileEarmarkXFill } from "react-icons/bs";

import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import ExcelJS from "exceljs";

function StokOpname() {
  const [profile, setProfile] = useState([]);
  const history = useHistory();
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
        // console.log(res.data, "DATA API STOK OPNAME");
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
        // console.log(res.data.result);
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
    // console.log(Penanggungjawab);
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
    // console.log(filteredData, "FILER DATAAA!!!!");
    // Mengirim data ke API
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/stok-opname/post/tutup-so`,
        filteredData
      )
      .then((response) => {
        // console.log("Data berhasil dikirim:", response.data);
        history.push(`/gfk/daftar-obat`);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengirim data:", error);
      });
  }

  async function exportToExcel() {
    const dataExport = dataStokOpname
      .map((item) => {
        const filteredBatches = item.noBatches.filter(
          (batch) => batch.status === 1
        );
        return {
          nama: item.nama,
          satuan: item.satuan.nama,
          noBatches: filteredBatches,
          totalStok: item.totalStok,
        };
      })
      .filter((item) => item.noBatches.length > 0);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stok Opname");

    // Menambahkan header
    worksheet.columns = [
      { header: "Nama Obat", key: "namaObat", width: 30 },
      { header: "Satuan", key: "satuan", width: 15 },
      { header: "kemasan", key: "kemasan", width: 15 },
      { header: "No Batch", key: "noBatch", width: 15 },
      { header: "Exp", key: "exp", width: 15 },
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
    dataExport.forEach((item, itemIndex) => {
      if (item.noBatches.length > 0) {
        const totalStok = item.totalStok; // Ambil total stok untuk nama obat
        item.noBatches.forEach((batch, index) => {
          const rowData = {
            namaObat: index === 0 ? item.nama : "", // Hanya isi nama obat di baris pertama
            satuan: item.satuan.nama,
            kemasan: batch.kotak,
            noBatch: batch.noBatch,
            exp: formatDate(batch.exp),
            stok: batch.amprahanItems[0] ? "" : batch.stok, // Kondisi untuk stok
            totalStok: "", // Hanya isi total stok di baris pertama
          };
          const newRow = worksheet.addRow(rowData);
          newRow.height = 38; // Mengatur tinggi baris menjadi 38

          // Mengatur warna sel untuk stok
          const cellStok = worksheet.getCell(newRow.number, 6); // Ambil sel untuk stok
          cellStok.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: batch.amprahanItems[0] ? "FFFF00" : "FFFFFF" }, // Warna orange jika true, putih jika false
          };

          // Mengatur warna sel untuk total stok berdasarkan itemIndex
          const cellTotalStok = worksheet.getCell(newRow.number, 7); // Ambil sel untuk total stok
          cellTotalStok.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: itemIndex % 2 === 0 ? "FFFFFF" : "FABF8F" }, // Selang-seling warna berdasarkan itemIndex
          };

          // Mengatur alignment dan font untuk semua sel di baris ini
          Object.keys(rowData).forEach((key, colIndex) => {
            const cell = newRow.getCell(colIndex + 1); // Ambil sel berdasarkan indeks kolom
            cell.alignment = { horizontal: "left", vertical: "middle" }; // Rata kiri dan tengah vertikal
            cell.font = { size: 14 }; // Mengatur ukuran font menjadi 14
          });
        });

        // Menggabungkan sel Nama Obat
        const lastRow = worksheet.lastRow.number; // Ambil nomor baris terakhir
        worksheet.mergeCells(currentRow, 1, lastRow, 1); // Menggabungkan sel dari currentRow ke lastRow di kolom 1 (Nama Obat)

        // Menggabungkan sel Total Stok
        worksheet.mergeCells(currentRow, 7, lastRow, 7); // Menggabungkan sel dari currentRow ke lastRow di kolom 5 (Total Stok)

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
        <Box
          backgroundImage={`url(${Batik})`}
          bgColor={"secondary"}
          py={"50px"}
          mt={"50px"}
        >
          <Container
            maxW={"1280px"}
            p={"30px"}
            bgColor={"white"}
            borderRadius={"5px"}
          >
            <HStack>
              <Button
                // bgColor={"white"}
                // color={"primary"}
                fontSize={"25px"}
                variant={"secondary"}
                onClick={exportToExcel}
                colorScheme="teal"
              >
                <BsFileEarmarkXFill />
              </Button>

              <Button
                variant={"primary"}
                onClick={onTutupSOOpen}
                isDisabled={Penanggungjawab === 0 || Penanggungjawab === null}
              >
                Tambahkan SO
              </Button>
            </HStack>

            <Box>
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
            <Box mt="20px" style={{ overflowX: "auto" }}>
              <Table variant="simple" width="100%">
                <Thead>
                  <Tr>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Nama Obat
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Satuan
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Kemasan
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      No Batch
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Exp
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Stok
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Total Stok
                    </Th>
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
                            borderWidth="1px"
                            borderColor="primary"
                            rowSpan={batches.length}
                          >
                            {item.nama}
                          </Td>
                          <Td
                            rowSpan={batches.length}
                            borderWidth="1px"
                            borderColor="primary"
                          >
                            {item.satuan.nama}
                          </Td>
                          <Td borderWidth="1px" borderColor="primary">
                            {batches[0].kotak} / kemasan
                          </Td>
                          <Td borderWidth="1px" borderColor="primary">
                            {batches[0].noBatch}
                          </Td>
                          <Td borderWidth="1px" borderColor="primary">
                            {formatDate(batches[0].exp)}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            bgColor={
                              batches[0].amprahanItems[0] ? "orange" : null
                            }
                          >
                            {batches[0].stok}
                          </Td>
                          <Td
                            rowSpan={batches.length}
                            borderWidth="1px"
                            borderColor="primary"
                          >
                            {item.totalStok}
                          </Td>
                        </Tr>
                        {batches.slice(1).map((batch) => (
                          <Tr key={batch.noBatch}>
                            <Td borderWidth="1px" borderColor="primary">
                              {batch.kotak} / kemasan
                            </Td>
                            <Td borderWidth="1px" borderColor="primary">
                              {batch.noBatch}
                            </Td>
                            <Td borderWidth="1px" borderColor="primary">
                              {formatDate(batch.exp)}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              bgColor={batch.amprahanItems[0] ? "orange" : null}
                            >
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
              <Button variant={"primary"} onClick={tutupSO}>
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
