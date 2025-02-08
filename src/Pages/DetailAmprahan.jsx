import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Container,
  Flex,
  Spacer,
  Center,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  FormControl,
  Input,
  Heading,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { BsFileEarmarkXFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import Layout from "../Components/Layout";
import { useDisclosure } from "@chakra-ui/react";
import ExcelJS from "exceljs";
import { BsCartXFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import addFoto from "./../assets/add_photo.png";
import Batik from "../assets/BATIK.png";
function DetailAmprahan(props) {
  const [detailAmprahan, setDetailAmprahan] = useState([]);
  const [profile, setProfile] = useState([]);
  const [Penanggungjawab, setPenanggungjawab] = useState(0);
  const [inputValue, setInputValue] = useState(null);
  const history = useHistory();
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  async function exportToExcel() {
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
      worksheet.getCell(
        "A8"
      ).value = `Nomor : 442/    /${detailAmprahan.StatusAmprahan.nama}/    /${year}`;
      worksheet.getCell("A8").alignment = { horizontal: "center" };

      worksheet.mergeCells("A9:I9");
      worksheet.getCell("A9").value = `Tanggal : ${newTanggal}`;
      worksheet.getCell("A9").alignment = { horizontal: "center" };

      worksheet.mergeCells("A11:G11");
      worksheet.getCell(
        "A11"
      ).value = `Dialamatkan kepada : ${detailAmprahan?.uptd?.nama}`;
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
      detailAmprahan?.amprahanItems?.forEach((item, index) => {
        const row = worksheet.addRow([
          " ",
          index + 1,
          item.noBatch.obat.nama,
          item.noBatch.obat.satuan.nama,
          item.noBatch.noBatch,
          formatDate(item.noBatch.exp),
          item.permintaan,
          item.noBatch.obat.sumberDana.sumber,
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

  function formatTanggal(dateString) {
    var objekTanggal = new Date(dateString);

    // Mengambil nilai hari, bulan, dan tahun
    var hari = objekTanggal.getUTCDate();
    var bulan = objekTanggal.toLocaleString("default", { month: "short" });
    var tahun = objekTanggal.getUTCFullYear();

    // Menggabungkan hasilnya
    return `${hari} ${bulan} ${tahun}`;
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
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return ` ${month}, ${year}`;
  }

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const newTanggal = formatTanggal(detailAmprahan?.tanggal);

  function renderProfile() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function ubahPermintaan(val) {
    // console.log(val, "PERMINTAAN", inputValue);
    axios
      .patch(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/patch/ubah-permintaan`,
        {
          id: val.id,
          permintaan: val.permintaan,
          permintaanBaru: parseInt(inputValue),
          sisa: val.sisa,
          obatId: val.noBatch.obat.id,
          totalStok: val.noBatch.obat.totalStok,
          stok: val.noBatch.stok,
          noBatchId: val.noBatch.id,
        }
      )
      .then((res) => {
        // console.log(res.data);
        setEditIndex(null);
        setDeleteIndex(null);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function tutup() {
    axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/tutup/${
          detailAmprahan.id
        }`
      )
      .then((res) => {
        // console.log(res.data);
        history.push("/gfk/amprahan");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function fetchDetailAmprahan() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/detail/${
          props.match.params.amprahanId
        }?penanggungjawab=${Penanggungjawab}`
      )
      .then((res) => {
        console.log(res.data.result);
        setDetailAmprahan(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchDetailAmprahan();
    fetchProfile();
    // console.log(Penanggungjawab);
    // console.log(typeof Penanggungjawab);
  }, [Penanggungjawab]);

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

  function renderItemAmprahan() {
    return detailAmprahan?.amprahanItems?.map((val, idx) => {
      const newExp = formatDate(val.noBatch.exp);

      return (
        <>
          <Box key={idx} display={{ ss: "none", sl: "block" }}>
            <Center>
              <Flex
                py={"10px"}
                borderBottom={"1px"}
                borderColor={"rgba(229, 231, 235, 1)"}
              >
                <Image
                  width={"55px"}
                  height={"75px"}
                  borderRadius={"5px"}
                  overflow="hiden"
                  objectFit="cover"
                  me={"5px"}
                  src={
                    val.noBatch.pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        val.noBatch.pic
                      : addFoto
                  }
                />
                <Text width={"190px"} me={"10px"}>
                  {val.noBatch.obat.nama}
                </Text>
                <Text width={"100px"} me={"10px"}>
                  {val.noBatch.noBatch}
                </Text>
                <Text me={"10px"} width={"100px"}>
                  {newExp}
                </Text>
                <Text me={"10px"} width={"80px"}>
                  {val.noBatch.obat.satuan.nama}
                </Text>
                <Text me={"10px"} width={"100px"}>
                  {val.permintaan}
                </Text>
                <Text me={"10px"} width={"80px"}>
                  {`${Math.floor(val.permintaan / val.noBatch.kotak)} kotak` +
                    (val.permintaan % val.noBatch.kotak !== 0
                      ? ` dan ${val.permintaan % val.noBatch.kotak} ecer`
                      : "")}
                </Text>
                {detailAmprahan.isOpen === 0 ? null : (
                  <>
                    <Tooltip label="Ubah" aria-label="A tooltip">
                      <Center
                        onClick={() => {
                          setEditIndex(idx);
                        }}
                        borderRadius={"5px"}
                        as="button"
                        h="30px"
                        w="30px"
                        fontSize="15px"
                        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                        color="white"
                        me={"10px"}
                        _hover={{
                          bg: "black",
                        }}
                        bg="green"
                        // onClick={onOpen}
                      >
                        <BsPencilFill />
                      </Center>
                    </Tooltip>{" "}
                    <Tooltip label="Hapus" aria-label="A tooltip">
                      <Center
                        onClick={() => {
                          setDeleteIndex(idx);
                        }}
                        borderRadius={"5px"}
                        as="button"
                        h="30px"
                        w="30px"
                        fontSize="15px"
                        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                        color="white"
                        _hover={{
                          bg: "black",
                        }}
                        bg="red"
                        // onClick={onOpen}
                      >
                        <BsCartXFill />
                      </Center>
                    </Tooltip>{" "}
                  </>
                )}
              </Flex>
            </Center>
            <Modal
              closeOnOverlayClick={false}
              isOpen={editIndex === idx || deleteIndex === idx}
              onClose={() => {
                setEditIndex(null);
                setDeleteIndex(null);
              }}
            >
              <ModalOverlay />
              <ModalContent borderRadius={0}>
                <ModalHeader>
                  {editIndex === idx ? "Ubah Permintaan" : "Hapus Permintaan"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  {editIndex === idx ? (
                    <FormControl pb="20px">
                      <Input
                        mt={"10px"}
                        type="number"
                        placeholder="stok"
                        border="1px"
                        borderRadius={"8px"}
                        borderColor={"rgba(229, 231, 235, 1)"}
                        defaultValue={val.permintaan}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </FormControl>
                  ) : (
                    <Text>
                      Apakah Anda yakin ingin menghapus permintaan ini?
                    </Text>
                  )}
                </ModalBody>

                <ModalFooter>
                  {editIndex === idx ? (
                    <Button
                      onClick={(e) => {
                        ubahPermintaan(val);
                      }}
                      bg={"green"}
                      color={"white"}
                      _hover={{
                        bg: "black",
                      }}
                    >
                      Ubah
                    </Button>
                  ) : (
                    <Button
                      height={"20px"}
                      width={"60px"}
                      fontSize={"12px"}
                      onClick={(e) => {
                        hapusPermintaan(val);
                      }}
                    >
                      Hapus
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          <Box
            p={"10px"}
            display={{ ss: "block", sl: "none" }}
            my={"20px"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
          >
            {" "}
            <HStack mb={"10px"}>
              {" "}
              <Text fontSize={"16px"} me={"10px"} fontWeight={700}>
                {val.noBatch.obat.nama}
              </Text>{" "}
              <Spacer />
              {detailAmprahan.isOpen === 0 ? null : (
                <>
                  <Tooltip label="Ubah" aria-label="A tooltip">
                    <Center
                      onClick={() => {
                        setEditIndex(idx);
                      }}
                      borderRadius={"5px"}
                      as="button"
                      h="30px"
                      w="30px"
                      fontSize="15px"
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      color="white"
                      me={"5px"}
                      _hover={{
                        bg: "black",
                      }}
                      bg="green"
                      // onClick={onOpen}
                    >
                      <BsPencilFill />
                    </Center>
                  </Tooltip>{" "}
                  <Tooltip label="Hapus" aria-label="A tooltip">
                    <Center
                      onClick={() => {
                        setDeleteIndex(idx);
                      }}
                      borderRadius={"5px"}
                      as="button"
                      h="30px"
                      w="30px"
                      fontSize="15px"
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      color="white"
                      _hover={{
                        bg: "black",
                      }}
                      bg="red"
                      // onClick={onOpen}
                    >
                      <BsCartXFill />
                    </Center>
                  </Tooltip>{" "}
                </>
              )}
            </HStack>
            <Flex>
              <Image
                width={"80px"}
                height={"100px"}
                borderRadius={"5px"}
                overflow="hiden"
                objectFit="cover"
                me={"5px"}
                src={
                  val.noBatch.pic
                    ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                      val.noBatch.pic
                    : addFoto
                }
              />
              <Box w={"100%"}>
                {" "}
                <Flex>
                  {" "}
                  <Text width={"50%"}>{val.noBatch.noBatch}</Text>
                  <Text width={"50%"}>{newExp}</Text>
                </Flex>
                <Text me={"10px"}>
                  {val.permintaan} {val.noBatch.obat.satuan.nama}
                </Text>
                <Text me={"10px"}></Text>
              </Box>
            </Flex>
          </Box>
        </>
      );
    });
  }

  function hapusPermintaan(val) {
    // console.log(val, "DELETE PERMINTAAN");
    // Tambahkan logika untuk menghapus permintaan di sini
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/delete/amparahan-item`,
        {
          id: val.id,
          permintaan: val.permintaan,
          sisa: val.sisa,
          obatId: val.noBatch.obat.id,
          totalStok: val.noBatch.obat.totalStok,
          stok: val.noBatch.stok,
          noBatchId: val.noBatch.id,
        }
      )
      .then((res) => {
        // console.log(res.data);
        setEditIndex(null);
        setDeleteIndex(null);
        fetchDetailAmprahan();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function exportToExcelAmrahan() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detail Amprahan");

    // Mengatur ukuran kertas menjadi A5 dan tampilan awal menjadi Page Layout
    worksheet.pageSetup = {
      paperSize: 9, // 9 adalah kode untuk ukuran A5
      orientation: "portrait", // atau 'landscape' untuk orientasi lanskap
      fitToPage: true, // Mengatur agar konten sesuai dengan halaman
      view: "pageLayout", // Mengatur tampilan awal menjadi Page Layout
    };

    // Menambahkan kalimat "FASYANKES" dan tanggal
    worksheet.addRow([`FASYANKES: ${detailAmprahan?.uptd?.nama}`]).font = {
      bold: true,
    }; // Menambahkan kalimat FASYANKES
    worksheet.addRow([`Tanggal: ${newTanggal}`]); // Menambahkan tanggal

    // Menambahkan judul kolom
    worksheet.addRow(["NAMA OBAT", "BATCH", "ED", "PEMBERIAN"]); // Judul kolom

    // Menambahkan data
    detailAmprahan?.amprahanItems?.forEach((item) => {
      worksheet.addRow([
        item.noBatch.obat.nama,
        item.noBatch.noBatch,
        formatDate(item.noBatch.exp),
        item.permintaan,
      ]);
    });

    // Menyimpan file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Detail_Amprahan.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  return (
    <Layout>
      <Box
        backgroundImage={`url(${Batik})`}
        pt={"80px"}
        bgColor={"rgba(249, 250, 251, 1)"}
        pb={"40px"}
      >
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          <Box>
            <Heading mb={"10px"}> Tujuan: {detailAmprahan?.uptd?.nama}</Heading>

            <Text fontSize={"20px"} fontWeight={600}>
              {" "}
              Tanggal: {newTanggal}
            </Text>
          </Box>
          <Flex>
            <FormControl my="20px">
              <FormLabel>Pilih Penanggung jawab</FormLabel>
              <Select
                placeholder="Penanggungjawab"
                border="1px"
                width={"100%"}
                borderRadius={"5px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  setPenanggungjawab(parseInt(e.target.value));
                }}
              >
                {renderProfile()}
              </Select>
            </FormControl>
          </Flex>
          <Flex gap={3}>
            <Button
              // bgColor={"white"}
              // color={"primary"}

              variant={"secondary"}
              onClick={exportToExcelAmrahan}
              colorScheme="teal"
            >
              <BsFileEarmarkXFill />
            </Button>
            <Button gap={2} onClick={exportToExcel} variant={"secondary"}>
              <BsFileEarmarkXFill /> SBBK
            </Button>
            {detailAmprahan.isOpen === 0 ? null : (
              <>
                {" "}
                <Button variant={"primary"} onClick={tutup}>
                  Tutup
                </Button>
              </>
            )}
          </Flex>
        </Container>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
          mt={"20px"}
        >
          <Center
            mt={"40px"}
            borderTop={"1px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            py={"10px"}
            display={{ ss: "none", sl: "flex" }}
          >
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"250px"}
              me={"10px"}
            >
              Nama
            </Text>
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"100px"}
              me={"10px"}
            >
              Nomor Batch
            </Text>{" "}
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"100px"}
              me={"10px"}
            >
              EXP
            </Text>{" "}
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
              Satuan
            </Text>{" "}
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"100px"}
              me={"10px"}
            >
              Permintaan
            </Text>{" "}
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
              Kotak
            </Text>{" "}
            {detailAmprahan.isOpen === 0 ? null : (
              <>
                {" "}
                <Text
                  fontSize={"15px"}
                  fontWeight={600}
                  width={"80px"}
                  me={"10px"}
                >
                  Aksi
                </Text>{" "}
              </>
            )}
          </Center>
          {renderItemAmprahan()}
        </Container>
      </Box>
    </Layout>
  );
}

export default DetailAmprahan;
