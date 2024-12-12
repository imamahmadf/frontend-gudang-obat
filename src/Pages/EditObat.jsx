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
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Input,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "../Components/Layout";

function EditObat(props) {
  const [dataObat, setDataObat] = useState([]);
  const [riwayatData, setRiwayatData] = useState([]);
  const [dataSeeder, setDataSeeder] = useState({});
  const [editedData, setEditedData] = useState({
    id: "",
    nama: "",
    kategori: { id: "", nama: "" },
    satuan: { id: "", nama: "" },
    kelasterapi: { id: "", nama: "" },
    totalStok: 0,
  });
  const [editingColumn, setEditingColumn] = useState(null);
  const [originalData, setOriginalData] = useState({});

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  async function deletBtnHandlerObat(val) {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/delete`, {
        old_img: dataObat.pic,
        id: props.match.params.obatId,
      })
      .then(() => {
        alert("wwww");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchDataSeedrs() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/pengaturan/get/seeders`
      )
      .then((res) => {
        console.log(res.data, "DATA SEEDERS");
        setDataSeeder(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function fetchData() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/edit/${
          props.match.params.obatId
        }`
      )
      .then((res) => {
        console.log(res.data);
        setDataObat(res.data.result);
        setRiwayatData(res.data.getRiwayat);
        setEditedData({
          id: res.data.result.id,
          nama: res.data.result.nama,
          kategori: {
            id: res.data.result.kategori.id,
            nama: res.data.result.kategori.nama,
          },
          satuan: {
            id: res.data.result.satuan.id,
            nama: res.data.result.satuan.nama,
          },
          kelasterapi: {
            id: res.data.result.kelasterapi.id,
            nama: res.data.result.kelasterapi.nama,
          },
          totalStok: res.data.result.totalStok,
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  useEffect(() => {
    fetchData();
    fetchDataSeedrs();
    //console.log(bank);
  }, []);
  console.log(dataObat.pic);

  const handleEditClick = (column) => {
    setOriginalData({ ...editedData });
    setEditingColumn(column);
  };

  const patchObat = async () => {
    console.log(editedData, "cek data yangdikirim ke API!!!");
    await axios
      .patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/patch/obat`, {
        id: editedData.id,
        nama: editedData.nama,
        kategoriId: editedData.kategori.id || originalData.kategori.id,
        satuanId: editedData.satuan.id || originalData.satuan.id,
        kelasterapiId: editedData.kelasterapi.id || originalData.kelasterapi.id,
      })
      .then((res) => {
        console.log(res.data, "TTTTTTTTTTTTTTs");
        fetchData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSaveClick = () => {
    patchObat();
    setEditingColumn(null);
  };

  const handleCancelClick = () => {
    setEditedData(originalData);
    setEditingColumn(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setEditedData({
      ...editedData,
      [name]: { ...editedData[name], id: value },
    });
  };

  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
          <Container
            mt={"30px"}
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <Box>
              <Text>{props.match.params.obatId}</Text>
              <Text>TESSSSS</Text>
              <Button onClick={onDeleteOpen}>reee</Button>

              <Box mt={4}>
                <Text fontSize="lg" mb={2}>
                  Riwayat Obat
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Riwayat</Th>
                      <Th>Nama Profile</Th>
                      <Th>Tanggal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {riwayatData.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item?.riwayat}</Td>
                        <Td>{item?.profile?.nama}</Td>
                        <Td>{new Date(item.createdAt).toLocaleDateString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Container>
          <Container
            mt={"30px"}
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <Box mt={4}>
              <Text textAlign={"center"} fontSize="lg">
                Data Obat
              </Text>
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Th>Nama</Th>
                    <Td>
                      {editingColumn === "nama" ? (
                        <Input
                          name="nama"
                          value={editedData.nama}
                          onChange={handleInputChange}
                        />
                      ) : (
                        editedData.nama
                      )}
                    </Td>
                    <Td>
                      {editingColumn === "nama" ? (
                        <>
                          <Button onClick={handleSaveClick}>Simpan</Button>
                          <Button onClick={handleCancelClick}>Batal</Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick("nama")}
                          isDisabled={!editedData.nama}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Kategori</Th>
                    <Td>
                      {editingColumn === "kategori" ? (
                        <Select
                          defaultValue={editedData.kategori.id}
                          onChange={(e) =>
                            handleSelectChange("kategori", e.target.value)
                          }
                        >
                          <option value="">Pilih Kategori</option>
                          {dataSeeder.kategoriSeed &&
                            dataSeeder.kategoriSeed.map((kategori) => (
                              <option key={kategori.id} value={kategori.id}>
                                {kategori.nama}
                              </option>
                            ))}
                        </Select>
                      ) : (
                        editedData.kategori.nama || "Tidak ada kategori"
                      )}
                    </Td>
                    <Td>
                      {editingColumn === "kategori" ? (
                        <>
                          <Button onClick={handleSaveClick}>Simpan</Button>
                          <Button onClick={handleCancelClick}>Batal</Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick("kategori")}
                          isDisabled={!editedData.kategori.nama}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Th>Satuan</Th>
                    <Td>
                      {editingColumn === "satuan" ? (
                        <Select
                          value={editedData.satuan.id}
                          onChange={(e) =>
                            handleSelectChange("satuan", e.target.value)
                          }
                        >
                          <option value="">Pilih Satuan</option>
                          {dataSeeder.satuanSeed &&
                            dataSeeder.satuanSeed.map((satuan) => (
                              <option key={satuan.id} value={satuan.id}>
                                {satuan.nama}
                              </option>
                            ))}
                        </Select>
                      ) : (
                        editedData.satuan.nama || "Tidak ada satuan"
                      )}
                    </Td>
                    <Td>
                      {editingColumn === "satuan" ? (
                        <>
                          <Button onClick={handleSaveClick}>Simpan</Button>
                          <Button onClick={handleCancelClick}>Batal</Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick("satuan")}
                          isDisabled={!editedData.satuan.nama}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>

                  {/* ////////////////////// */}
                  <Tr>
                    <Th>Kelas Terapi</Th>
                    <Td>
                      {editingColumn === "kelasterapi" ? (
                        <Select
                          value={editedData.kelasterapi.id}
                          onChange={(e) =>
                            handleSelectChange("kelasterapi", e.target.value)
                          }
                        >
                          <option value="">Pilih Kelas Terapi</option>
                          {dataSeeder.kelasterapiSeed &&
                            dataSeeder.kelasterapiSeed.map((kelasterapi) => (
                              <option
                                key={kelasterapi.id}
                                value={kelasterapi.id}
                              >
                                {kelasterapi.nama}
                              </option>
                            ))}
                        </Select>
                      ) : (
                        editedData.kelasterapi.nama || "Tidak ada kelas terapi"
                      )}
                    </Td>
                    <Td>
                      {editingColumn === "kelasterapi" ? (
                        <>
                          <Button onClick={handleSaveClick}>Simpan</Button>
                          <Button onClick={handleCancelClick}>Batal</Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick("kelasterapi")}
                          isDisabled={!editedData.kelasterapi.nama}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>

                  {/* /////////////////// */}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>aaaaa</ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  deletBtnHandlerObat();
                }}
                variant="ghost"
              >
                Secondary Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default EditObat;
