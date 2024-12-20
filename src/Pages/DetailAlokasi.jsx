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
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";

function DetailAlokasi(props) {
  const [detailAlokasi, setDetailAlokasi] = useState([]);
  async function fetchDetailAlokasi() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/get/detail/${
          props.match.params.alokasiId
        }`
      )
      .then((res) => {
        setDetailAlokasi(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDetailAlokasi();
  }, []);

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detail Alokasi");

    // Menambahkan header
    worksheet.columns = [
      { header: "UPTD", key: "uptd", width: 30 },
      { header: "Obat", key: "obat", width: 30 },
      { header: "No Batch", key: "noBatch", width: 20 },
      { header: "Permintaan", key: "permintaan", width: 20 },
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
    detailAlokasi.amprahans.forEach((amprahan) => {
      const firstItem = amprahan.amprahanItems[0]; // Ambil item pertama untuk UPTD
      worksheet.addRow({
        uptd: amprahan.uptd.nama,
        obat: firstItem.noBatch.obat.nama,
        noBatch: firstItem.noBatch.noBatch,
        permintaan: firstItem.permintaan,
      });

      // Tambahkan item lainnya tanpa mengulang UPTD
      amprahan.amprahanItems.slice(1).forEach((item) => {
        worksheet.addRow({
          uptd: "", // Kosongkan UPTD untuk baris berikutnya
          obat: item.noBatch.obat.nama,
          noBatch: item.noBatch.noBatch,
          permintaan: item.permintaan,
        });
      });

      // Menggabungkan sel UPTD
      const lastRow = worksheet.lastRow.number; // Ambil nomor baris terakhir
      worksheet.mergeCells(currentRow, 1, lastRow, 1); // Menggabungkan sel dari currentRow ke lastRow di kolom 1 (UPTD)
      currentRow = lastRow + 1; // Update currentRow untuk baris berikutnya
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
      a.download = "Detail_Alokasi.xlsx";
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
            borderRadius={"5px"}
            bgColor={"white"}
          >
            {/* Menggunakan tabel Chakra UI dengan garis */}
            <Box style={{ overflowX: "auto" }}>
              <Table variant="simple" borderWidth="1px" borderColor="gray.200">
                <Thead>
                  <Tr>
                    <Th borderWidth="1px" borderColor="gray.200">
                      UPTD
                    </Th>
                    <Th borderWidth="1px" borderColor="gray.200">
                      Obat
                    </Th>
                    <Th borderWidth="1px" borderColor="gray.200">
                      No Batch
                    </Th>
                    <Th borderWidth="1px" borderColor="gray.200">
                      Permintaan
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detailAlokasi.amprahans &&
                    detailAlokasi.amprahans.map((amprahan, index) => (
                      <>
                        <Tr key={`header-${index}`}>
                          <Td
                            borderWidth="1px"
                            borderColor="gray.200"
                            rowSpan={amprahan.amprahanItems.length}
                          >
                            {amprahan.uptd.nama}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {amprahan.amprahanItems[0].noBatch.obat.nama}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {amprahan.amprahanItems[0].noBatch.noBatch}
                          </Td>
                          <Td borderWidth="1px" borderColor="gray.200">
                            {amprahan.amprahanItems[0].permintaan}
                          </Td>
                        </Tr>
                        {amprahan.amprahanItems.slice(1).map((item) => (
                          <Tr key={item.noBatch.id}>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {item.noBatch.obat.nama}
                            </Td>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {item.noBatch.noBatch}
                            </Td>
                            <Td borderWidth="1px" borderColor="gray.200">
                              {item.permintaan}
                            </Td>
                          </Tr>
                        ))}
                      </>
                    ))}
                </Tbody>
              </Table>
            </Box>
            {/* Akhir tabel */}
            <Button onClick={exportToExcel} colorScheme="teal" mb={4}>
              Ekspor ke Excel
            </Button>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default DetailAlokasi;
