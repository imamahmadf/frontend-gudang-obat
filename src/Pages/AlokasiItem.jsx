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
  Input,
  Flex,
  Text,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";

function AlokasiItem(props) {
  const [dataAlokasi, setDataAlokasi] = useState([]);
  const [dataObat, setDataObat] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [inputVisibleStates, setInputVisibleStates] = useState([]);
  const [inputValue, setInputValue] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

      // Set nilai default untuk selectedBatch jika ada noBatches
      if (res.data.getObat[0]?.noBatches?.length > 0) {
        setSelectedBatch(res.data.getObat[0].noBatches[0]); // Set ke batch pertama
      }

      console.log(res.data.result);
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

    const newInputValues = [...inputValues];
    const id = dataAlokasi[0]?.amprahans[index].id; // Ambil ID dari item yang bersangkutan
    newInputValues[index] = { id, value: inputValue }; // Simpan objek dengan ID dan nilai input
    setInputValues(newInputValues); // Update state dengan nilai baru
    console.log("Data dikirim:", newInputValues[index]); // Tampilkan data yang dikirim

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
        console.log(res.data);
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
    console.log("Mengirim semua ID:", allIds);

    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/tutup-alokasi`,
        { dataId: allIds }
      )
      .then((res) => {
        console.log(res.data);
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
      <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
        <Container maxW={"1280px"} p={"0px"}>
          <Flex>
            <Box
              bgColor={"white"}
              borderRadius={"5px"}
              w={"50%"}
              me={"10px"}
              p={"15px"}
            >
              <FormControl mt={"20px"}>
                <FormLabel>Pilih Nomor Batch</FormLabel>
                <Select
                  mt="5px"
                  placeholder="Kelas Terapi"
                  border="1px"
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  onChange={handleBatchChange}
                  value={selectedBatch?.id || ""} // Set nilai default
                >
                  {renderNoBatch()}
                </Select>
              </FormControl>{" "}
              <Button mt="20px" onClick={handleClose}>
                Tutup
              </Button>
            </Box>
            <Box
              bgColor={"white"}
              borderRadius={"5px"}
              w={"50%"}
              p={"20px"}
              ms={"10px"}
            >
              {selectedBatch && (
                <Table variant="simple" size="md" mt="20px">
                  <Thead>
                    <Tr>
                      <Th>No Batch</Th>
                      <Th>Stok</Th>
                      <Th>EXP</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{selectedBatch.noBatch}</Td>
                      <Td>{selectedBatch.stok}</Td>
                      <Td>{formatDate(selectedBatch.exp)}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
            </Box>
          </Flex>
        </Container>

        <Container
          mt={"30px"}
          maxW={"1280px"}
          bgColor={"white"}
          borderRadius={"5px"}
          p={"30px"}
        >
          {" "}
          <Flex
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
              <Box>
                <Flex
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
                              <Box mt={"10px"}>{val2.permintaan}</Box>
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
                            <>
                              <Box mt={"10px"}>{val2.noBatch.noBatch}</Box>
                            </>
                          );
                        })
                      : "-"}
                  </Box>
                  <Spacer />
                  <Box w={"80px"}>
                    <Button onClick={() => handleInputVisibility(index)}>
                      Submit
                    </Button>
                  </Box>
                </Flex>
                {isInputVisible && (
                  <Flex mt="10px">
                    <Input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Masukkan jumlah"
                    />
                    <Button mx={"10px"} onClick={() => handleSubmit(index)}>
                      Kirim
                    </Button>
                    <Button onClick={() => handleInputVisibility(null)}>
                      Batal
                    </Button>
                    {errorMessage && (
                      <Text color="red.500" mt="5px">
                        {errorMessage}
                      </Text>
                    )}
                  </Flex>
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
