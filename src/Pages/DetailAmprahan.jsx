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
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../Components/Layout";
import { useDisclosure } from "@chakra-ui/react";
import ExcelJS from "exceljs";
import { BsCartXFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import addFoto from "./../assets/add_photo.png";
function DetailAmprahan(props) {
  const [detailAmprahan, setDetailAmprahan] = useState([]);
  const [profile, setProfile] = useState([]);
  const [Penanggungjawab, setPenanggungjawab] = useState(0);
  const [inputValue, setInputValue] = useState(null);
  const history = useHistory();
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

    return `${day} ${month}, ${year}`;
  }

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const newTanggal = formatDate(detailAmprahan?.tanggal);

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
    console.log(val, "PERMINTAAN", inputValue);
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
        console.log(res.data);
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
        console.log(res.data);
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
    console.log(Penanggungjawab);
    console.log(typeof Penanggungjawab);
  }, [Penanggungjawab]);

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

  function renderItemAmprahan() {
    return detailAmprahan?.amprahanItems?.map((val, idx) => {
      const newExp = formatDate(val.noBatch.exp);

      return (
        <Box key={idx}>
          <Center
            py={"10px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
          >
            <Image
              width={"55px"}
              height={"55px"}
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
            <Text me={"10px"} width={"80px"}>
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
                  <Text>Apakah Anda yakin ingin menghapus permintaan ini?</Text>
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
      );
    });
  }

  function hapusPermintaan(val) {
    console.log(val, "DELETE PERMINTAAN");
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
        console.log(res.data);
        setEditIndex(null);
        setDeleteIndex(null);
        fetchDetailAmprahan();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detail Amprahan");

    // Mengatur ukuran kertas menjadi A5 dan tampilan awal menjadi Page Layout
    worksheet.pageSetup = {
      paperSize: 9, // 9 adalah kode untuk ukuran A5
      orientation: "portrait", // atau 'landscape' untuk orientasi lanskap
      fitToPage: true, // Mengatur agar konten sesuai dengan halaman
      view: "pageLayout", // Mengatur tampilan awal menjadi Page Layout
    };

    // Menambahkan header
    worksheet.columns = [
      { header: "Nama", key: "nama", width: 30 },
      { header: "Nomor Batch", key: "noBatch", width: 20 },
      { header: "EXP", key: "exp", width: 15 },
      { header: "Permintaan", key: "permintaan", width: 15 },
    ];

    // Menambahkan data
    detailAmprahan?.amprahanItems?.forEach((item) => {
      worksheet.addRow({
        nama: item.noBatch.obat.nama,
        noBatch: item.noBatch.noBatch,
        exp: formatDate(item.noBatch.exp),
        permintaan: item.permintaan,
      });
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
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          <Box>
            <Text fontSize={"20px"} fontWeight={600}>
              {" "}
              Tujuan: {detailAmprahan?.uptd?.nama}
            </Text>
            <Text fontSize={"20px"} fontWeight={600}>
              {" "}
              Tanggal: {newTanggal}
            </Text>
          </Box>
          <Flex>
            <Box minWidth={"600px"}></Box>

            <HStack align="flex-start" justify="flex-start">
              <Box
                p={"8px"}
                borderColor="gray" // Menambahkan border berwarna hitam
                borderRadius="5px" // Menambahkan border radius 5px
              >
                <FaRegUser />
              </Box>
              <Select
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
              <Button
                onClick={exportToExcel}
                colorScheme="teal"
                width={"200px"}
              >
                Ekspor ke Excel
              </Button>
            </HStack>
            {detailAmprahan.isOpen === 0 ? null : (
              <>
                {" "}
                <Button onClick={tutup}>Tutup</Button>
              </>
            )}
          </Flex>
          <Center
            borderTop={"1px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            py={"10px"}
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
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
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
