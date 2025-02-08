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
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Batik from "../assets/BATIK.png";
import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { BsFileEarmarkXFill } from "react-icons/bs";
import ExcelJS from "exceljs";

function DetailAlokasi(props) {
  const [detailAlokasi, setDetailAlokasi] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
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
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return ` ${month}, ${year}`;
  }
  async function exportSBBK(val) {
    console.log(val);
    try {
      // Mengambil file Excel dari backend
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/excel/amprahan`,
        {
          responseType: "arraybuffer", // Mengambil file sebagai array buffer
        }
      );

      // Membaca file Excel dengan ExcelJS
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data); // Memuat file Excel dari array buffer
      const worksheet = workbook.getWorksheet(1); // Ambil worksheet pertama

      // Memodifikasi file Excel
      const date = new Date();
      const year = date.getFullYear();

      // Mengatur ukuran kertas menjadi A4
      worksheet.pageSetup = {
        paperSize: 9, // 9 adalah kode untuk ukuran A4
        orientation: "portrait", // atau 'landscape' untuk orientasi lanskap
        fitToPage: true, // Mengatur agar konten sesuai dengan halaman
        view: "pageLayout", // Mengatur tampilan awal menjadi Page Layout
      };

      // Menambahkan header
      worksheet.mergeCells("A7:I7");
      worksheet.getCell("A7").value = "SURAT BUKTI BARANG KELUAR";
      worksheet.getCell("A7").font = { bold: true, size: 12 };
      worksheet.getCell("A7").alignment = { horizontal: "center" };

      // Atur lebar kolom A hingga G

      worksheet.getColumn(2).width = 20; // Atur lebar kolom B
      worksheet.getColumn(3).width = 20; // Atur lebar kolom C
      worksheet.getColumn(4).width = 20; // Atur lebar kolom D
      worksheet.getColumn(5).width = 20; // Atur lebar kolom E
      worksheet.getColumn(6).width = 20; // Atur lebar kolom F
      worksheet.getColumn(7).width = 20; // Atur lebar kolom G
      worksheet.getColumn(8).width = 20; // Atur lebar kolom H

      // worksheet.mergeCells("A7:I7");
      worksheet.getCell("A7").value = `SURAT BUKTI BARANG KELUAR`;
      worksheet.getCell("A7").alignment = { horizontal: "center", bold: true };

      worksheet.mergeCells("A8:I8");
      worksheet.getCell("A8").value = `Nomor : 442/    /alokasi/    /${year}`;
      worksheet.getCell("A8").alignment = { horizontal: "center" };

      worksheet.mergeCells("A9:I9");
      worksheet.getCell("A9").value = `Tanggal :`;
      worksheet.getCell("A9").alignment = { horizontal: "center" };

      worksheet.mergeCells("A11:G11");
      worksheet.getCell("A11").value = `Dialamatkan kepada : ${val.uptd?.nama}`;
      worksheet.getCell("A11").alignment = { horizontal: "center" };

      // Menambahkan tabel
      worksheet.addRow([]); // Baris kosong
      worksheet.addRow([
        "",
        "No",
        "Nama Obat",
        "Kemasan",
        "No. Batch",
        "Expire Date",
        "Jumlah",
        "Sumber",
      ]);
      worksheet.lastRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        if (colNumber === 1) {
          cell.border = null; // Menghapus border untuk kolom paling kiri
        } else {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      // Mengatur lebar kolom
      worksheet.getColumn(1).width = 0.87 * 5; // No
      worksheet.getColumn(2).width = 1 * 5; // No
      worksheet.getColumn(3).width = 4.9 * 5; // Nama Obat
      worksheet.getColumn(4).alignment = { wrapText: true };
      worksheet.getColumn(5).width = 2.35 * 5; // Kemasan
      worksheet.getColumn(6).width = 3.1 * 5; // No. Batch
      worksheet.getColumn(7).width = 2.25 * 5; // Expire Date (default width)
      worksheet.getColumn(8).width = 1.9 * 5; // Jumlah (default width)
      worksheet.getColumn(9).width = 2 * 5; // Sumber (default width)

      // Menambahkan data
      val.amprahanItems?.forEach((item, index) => {
        const row = worksheet.addRow([
          " ",
          index + 1,
          item.noBatch.obat.nama,
          "",
          item.noBatch.noBatch,
          formatDate(item.noBatch.exp),
          item.permintaan,
          "",
          // item.noBatch.obat.sumberDana.sumber,
        ]);
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1) {
            cell.border = null; // Menghapus border untuk kolom paling kiri
          } else {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
        });
      });

      // Menyimpan dan mengunduh file yang telah dimodifikasi
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Surat_Bukti_Barang_Keluar.xlsx"; // Nama file yang akan diunduh
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengekspor data ke Excel.");
    }
  }

  async function fetchDetailAlokasi() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/get/detail/${
          props.match.params.alokasiId
        }`
      )
      .then((res) => {
        setDetailAlokasi(res.data.result);
        // console.log(res.data.result);
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
      { header: "Tujuan", key: "uptd", width: 30 },
      { header: "Obat", key: "obat", width: 30 },
      { header: "No Batch", key: "noBatch", width: 20 },
      { header: "Pemberian", key: "permintaan", width: 20 },
      { header: "Tanda Tangan", key: "tandaTangan", width: 20 },
      { header: "Tanggal Pengambilan", key: "tanggalPengambilan", width: 20 },
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
        tandaTangan: "", // Kolom kosong untuk tanda tangan
        tanggalPengambilan: "", // Kolom kosong untuk tanggal pengambilan
      });

      // Tambahkan item lainnya tanpa mengulang UPTD
      amprahan.amprahanItems.slice(1).forEach((item) => {
        worksheet.addRow({
          uptd: "", // Kosongkan UPTD untuk baris berikutnya
          obat: item.noBatch.obat.nama,
          noBatch: item.noBatch.noBatch,
          permintaan: item.permintaan,
          tandaTangan: "", // Kolom kosong untuk tanda tangan
          tanggalPengambilan: "", // Kolom kosong untuk tanggal pengambilan
        });
      });

      // Menggabungkan sel UPTD
      const lastRow = worksheet.lastRow.number; // Ambil nomor baris terakhir
      worksheet.mergeCells(currentRow, 1, lastRow, 1); // Menggabungkan sel dari currentRow ke lastRow di kolom 1 (UPTD)

      // Menggabungkan sel untuk kolom "Tanda Tangan" dan "Tanggal Pengambilan"
      worksheet.mergeCells(currentRow, 5, lastRow, 5); // Kolom tanda tangan
      worksheet.mergeCells(currentRow, 6, lastRow, 6); // Kolom tanggal pengambilan

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
  function formatTanggal(dateString) {
    var objekTanggal = new Date(dateString);

    // Mengambil nilai hari, bulan, dan tahun
    var hari = objekTanggal.getUTCDate();
    var bulan = objekTanggal.toLocaleString("default", { month: "short" });
    var tahun = objekTanggal.getUTCFullYear();

    // Menggabungkan hasilnya
    return `${hari} ${bulan} ${tahun}`;
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
            borderRadius={"5px"}
            bgColor={"white"}
          >
            {/* Menggunakan tabel Chakra UI dengan garis */}
            <Flex mb={"20px"}>
              <Box>
                <Heading>{detailAlokasi.nama}</Heading>
                <Text>Tanggal: {formatTanggal(detailAlokasi.createdAt)}</Text>
              </Box>
              <Spacer />
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
            </Flex>
            <Box style={{ overflowX: "auto" }}>
              <Table variant="simple" borderWidth="1px" borderColor="gray.200">
                <Thead bgColor={"primary"}>
                  <Tr>
                    <Th borderWidth="1px" fontSize={"14px"} color={"white"}>
                      Tujuan
                    </Th>
                    <Th borderWidth="1px" fontSize={"14px"} color={"white"}>
                      Obat
                    </Th>
                    <Th borderWidth="1px" fontSize={"14px"} color={"white"}>
                      No Batch
                    </Th>
                    <Th borderWidth="1px" fontSize={"14px"} color={"white"}>
                      Pemberian
                    </Th>
                    <Th borderWidth="1px" fontSize={"14px"} color={"white"}>
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detailAlokasi.amprahans &&
                    detailAlokasi.amprahans.map((amprahan, index) => (
                      <React.Fragment key={amprahan.id}>
                        <Tr key={`header-${index}`}>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                            rowSpan={amprahan.amprahanItems.length}
                          >
                            {amprahan.uptd.nama}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {amprahan?.amprahanItems[0]?.noBatch?.obat.nama}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {amprahan.amprahanItems[0]?.noBatch?.noBatch}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                          >
                            {amprahan.amprahanItems[0]?.permintaan}
                          </Td>
                          <Td
                            borderWidth="1px"
                            borderColor="primary"
                            py={"15px"}
                            rowSpan={amprahan.amprahanItems.length}
                          >
                            <Button
                              fontSize={"12px"}
                              h={"25px"}
                              variant={"secondary"}
                              onClick={() => exportSBBK(amprahan)}
                            >
                              SBBK
                            </Button>
                          </Td>
                        </Tr>
                        {amprahan.amprahanItems.slice(1).map((item) => (
                          <Tr key={item.noBatch?.id}>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item?.noBatch.obat.nama}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item?.noBatch.noBatch}
                            </Td>
                            <Td
                              borderWidth="1px"
                              borderColor="primary"
                              py={"15px"}
                            >
                              {item?.permintaan}
                            </Td>
                          </Tr>
                        ))}
                      </React.Fragment>
                    ))}
                </Tbody>
              </Table>
            </Box>
            {/* Akhir tabel */}
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default DetailAlokasi;
