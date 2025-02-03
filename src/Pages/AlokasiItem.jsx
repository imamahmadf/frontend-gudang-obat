import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Button,
  Select,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Alert,
  Input,
  Flex,
  Text,
  Spacer,
  SimpleGrid,
  Image,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import Batik from "../assets/BATIK.png";
import Layout from "../Components/Layout";
import { BsXCircle } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import addFoto from "./../assets/add_photo.png";

function AlokasiItem(props) {
  const [dataAlokasi, setDataAlokasi] = useState([]);
  const [dataObat, setDataObat] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [inputVisibleStates, setInputVisibleStates] = useState([]);
  const [inputValue, setInputValue] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

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

  function renderNoBatch() {
    return dataObat?.noBatches?.map((val) => (
      <option key={val.id} value={val.id}>
        {val.noBatch}
      </option>
    ));
  }

  const fetchAlokasi = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/get/${
          props.match.params.obatId
        }`
      );
      setDataAlokasi(res.data.result);
      setDataObat(res.data.getObat[0]);
      // console.log(res.data);

      // Set nilai default untuk selectedBatch jika ada noBatches
      if (res.data.getObat[0]?.noBatches?.length > 0) {
        setSelectedBatch(res.data.getObat[0].noBatches[0]); // Set ke batch pertama
      }

      // console.log(res.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlokasi();
  }, []);

  const handleBatchChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = dataObat.noBatches.find((val) => val.id === selectedId);
    setSelectedBatch(selected);
  };

  const handleInputVisibility = (index) => {
    const newStates = Array(dataAlokasi[0]?.amprahans?.length).fill(false); // Reset semua ke false
    newStates[index] = true; // Set hanya yang dipilih menjadi true
    setInputVisibleStates(newStates);
  };

  const handleSubmit = (index) => {
    // Validasi jika selectedBatch tidak terisi
    if (!selectedBatch) {
      setErrorMessage("Pilih batch terlebih dahulu."); // Set pesan kesalahan
      return; // Jangan lanjutkan jika ada kesalahan
    }

    // Validasi input
    if (inputValue > selectedBatch.stok) {
      setErrorMessage("Nilai yang diinput tidak boleh lebih besar dari stok."); // Set pesan kesalahan
      return; // Jangan lanjutkan jika ada kesalahan
    }

    if (inputValue == 0) {
      setErrorMessage("Nilai yang diinput tidak boleh kosong"); // Set pesan kesalahan
      return; // Jangan lanjutkan jika ada kesalahan
    }

    const newInputValues = [...inputValues];
    const id = dataAlokasi[0]?.amprahans[index].id; // Ambil ID dari item yang bersangkutan
    newInputValues[index] = { id, value: inputValue }; // Simpan objek dengan ID dan nilai input
    setInputValues(newInputValues); // Update state dengan nilai baru
    // console.log("Data dikirim:", newInputValues[index]); // Tampilkan data yang dikirim

    // Reset input value dan sembunyikan input
    setInputValue(0); // Set nilai input menjadi 0
    setErrorMessage(""); // Reset pesan kesalahan
    handleInputVisibility(index); // Sembunyikan input setelah mengirim
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/post/amprahan-item?permintaan=${
          newInputValues[index].value
        }&amprahanId=${newInputValues[index].id}&userId=${1}&noBatchId=${
          selectedBatch.id
        }&obatId=${dataObat.id}&stokAwal=${selectedBatch.stok}`
      )
      .then((res) => {
        // console.log(res.data);
        setInputValues([]);
        setSelectedBatch(null);
        handleInputVisibility(null);
        fetchAlokasi();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    const allIds = dataAlokasi[0].amprahans.map((item) => item.id); // Ambil semua ID dari dataAlokasi
    // console.log("Mengirim semua ID:", allIds);

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/tutup-alokasi`,
        { dataId: allIds }
      )
      .then((res) => {
        // console.log(res.data);
        history.push("/");
      })
      .catch((err) => {
        console.error(err);
      });

    // Lakukan pengiriman data ke server atau logika lain yang diperlukan di sini
    // Misalnya, Anda bisa menggunakan axios.post untuk mengirim data
    // axios.post('your/api/endpoint', { ids: allIds })
  };

  return (
    <Layout>
      <Box
        bgColor={"secondary"}
        backgroundImage={`url(${Batik})`}
        py={"50px"}
        mt={"50px"}
      >
        <Container
          mb={"40px"}
          maxW={"1280px"}
          borderRadius={"5px"}
          p={"15px"}
          bgColor={"white"}
        >
          <Text fontSize={"24px"} fontWeight={600} mb={"20px"}>
            Nama Obat: {dataObat.nama}
          </Text>

          <SimpleGrid gap={4} minChildWidth="150px">
            <Box
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Text fontSize={"16px"} fontWeight={400}>
                Sumber Dana:
              </Text>
              <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                {dataObat?.sumberDana?.sumber}
              </Text>
            </Box>
            <Box
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Text fontSize={"16px"} fontWeight={400}>
                Kelas terapi:
              </Text>
              <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                {dataObat?.kelasterapi?.nama}
              </Text>
            </Box>
            <Box
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Text fontSize={"16px"} fontWeight={400}>
                Kategori:
              </Text>
              <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                {dataObat?.kategori?.nama}
              </Text>
            </Box>{" "}
            <Box
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Text fontSize={"16px"} fontWeight={400}>
                Satuan:
              </Text>
              <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                {dataObat?.satuan?.nama}
              </Text>
            </Box>
            <Box
              borderRadius={"5px"}
              border={"1px"}
              p={"15px"}
              borderColor={"secondary"}
            >
              <Text fontSize={"16px"} fontWeight={400}>
                Total Stok:
              </Text>
              <Text fontSize={"20px"} fontWeight={700} color={"primary"}>
                {dataObat?.totalStok}
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
        <Container maxW={"1280px"} p={"0px"}>
          <SimpleGrid minChildWidth="200px" gap={4}>
            <Box bgColor={"white"} borderRadius={"5px"} p={"15px"}>
              <FormControl mt={"20px"}>
                <FormLabel>Pilih Nomor Batch</FormLabel>
                <Select
                  mt="5px"
                  placeholder="Nomor Batch"
                  border="1px"
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  onChange={handleBatchChange}
                  value={selectedBatch?.id || ""} // Set nilai default
                >
                  {renderNoBatch()}
                </Select>
              </FormControl>{" "}
              <Button variant={"primary"} mt="20px" onClick={handleClose}>
                Tutup
              </Button>
            </Box>
            <Box
              style={{ overflowX: "auto" }}
              bgColor={"white"}
              borderRadius={"5px"}
              p={"20px"}
            >
              {selectedBatch && (
                <>
                  <HStack>
                    <Image
                      mt={"30px"}
                      borderRadius={"5px"}
                      alt="property image"
                      width={"50px"}
                      height={"70px"}
                      me="10px"
                      overflow="hiden"
                      objectFit="cover"
                      src={
                        selectedBatch.pic
                          ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                            selectedBatch.pic
                          : addFoto
                      }
                    />
                    <Table variant="simple" size="md" mt="20px">
                      <Thead>
                        <Tr>
                          <Th>No Batch</Th>
                          <Th>Stok</Th>
                          <Th>Kotak</Th>
                          <Th>EXP</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{selectedBatch.noBatch}</Td>
                          <Td>{selectedBatch.stok}</Td>
                          <Td>{selectedBatch.kotak}</Td>
                          <Td>{formatDate(selectedBatch.exp)}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </HStack>
                </>
              )}
            </Box>
          </SimpleGrid>
        </Container>

        <Container
          mt={"30px"}
          maxW={"1280px"}
          bgColor={"white"}
          borderRadius={"5px"}
          p={"30px"}
          style={{ overflowX: "auto" }}
        >
          <Text fontSize={"24px"} fontWeight={600} mb={"20px"}>
            Nama Alokasi: {dataAlokasi[0]?.nama}
          </Text>
          <Flex
            minW={"500px"}
            bgColor={"primary"}
            color={"white"}
            p={"10px"}
            borderRadius={"5px"}
            fontSize={"16px"}
            fontWeight={600}
          >
            <Box w={"140px"}>
              <Text>Tujuan Alokasi</Text>
            </Box>
            <Spacer />
            <Box w={"100px"}>
              <Text>Pemberian</Text>
            </Box>
            <Spacer />
            <Box w={"100px"}>
              {" "}
              <Text>No. batch</Text>
            </Box>
            <Spacer />
            <Text w={"80px"} textAlign={"right"} me={"10px"}>
              Aksi
            </Text>
          </Flex>
          {dataAlokasi[0]?.amprahans?.map((val, index) => {
            const isInputVisible = inputVisibleStates[index] || false;

            return (
              <Box key={val.id}>
                <Flex
                  minW={"500px"}
                  my={"15px"}
                  px={"10px"}
                  key={index}
                  borderTop={"1px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  py={"10px"}
                >
                  <Box w={"140px"}>{val.uptd.nama}</Box>
                  <Spacer />
                  <Box w={"100px"}>
                    {val.amprahanItems[0]
                      ? val.amprahanItems.map((val2) => {
                          return (
                            <>
                              <Box key={val2.id} mt={"10px"}>
                                {val2.permintaan}
                              </Box>
                            </>
                          );
                        })
                      : "-"}
                  </Box>
                  <Spacer />
                  <Box w={"100px"}>
                    {val.amprahanItems[0]
                      ? val.amprahanItems.map((val2) => {
                          return (
                            <Box key={val2.id} mt={"10px"}>
                              {val2.noBatch.noBatch}
                            </Box>
                          );
                        })
                      : "-"}
                  </Box>
                  <Spacer />
                  <Box>
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        handleInputVisibility(index);
                        setErrorMessage(null);
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Flex>
                {isInputVisible && (
                  <>
                    <Flex mt="10px" px={"10px"}>
                      <Input
                        type="number"
                        w={"100%"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Masukkan jumlah"
                      />
                      <Button
                        variant={"primary"}
                        mx={"10px"}
                        fontSize={"22px"}
                        onClick={() => handleSubmit(index)}
                      >
                        <BsPlusCircle />
                      </Button>
                      <Button
                        variant={"primary"}
                        _hover={{
                          bg: "black",
                        }}
                        bgColor={"danger"}
                        onClick={() => handleInputVisibility(null)}
                        fontSize={"22px"}
                      >
                        <BsXCircle />
                      </Button>
                    </Flex>
                    <Box px={"10px"}>
                      {errorMessage && (
                        <Alert status="error" color="red" text="center">
                          <Text color="red.500" mt="5px">
                            {errorMessage}
                          </Text>
                        </Alert>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            );
          })}
        </Container>
      </Box>
    </Layout>
  );
}

export default AlokasiItem;
