import { useState, useRef, useEffect } from "react";
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
  FormControl,
  FormLabel,
  Image,
  Alert,
  FormHelperText,
} from "@chakra-ui/react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "../Components/Layout";
import addFoto from "./../assets/add_photo.png";
import { useDispatch, useSelector } from "react-redux";
import Batik from "../assets/BATIK.png";

function EditObat(props) {
  const inputFileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeMsg, setFileSizeMsg] = useState("");
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
  const [dataNoBatch, setDataNoBatch] = useState([]);
  const [selectedNoBatch, setSelectedNoBatch] = useState({});

  const {
    isOpen: isNoBatchOpen,
    onOpen: onNoBatchOpen,
    onClose: onNoBatchClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { profileId } = useSelector((state) => state.user);

  const handleFile = (event) => {
    if (event.target.files[0].size / 1024 > 1024) {
      setFileSizeMsg("File size is greater than maximum limit");
    } else {
      setSelectedFile(event.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(event.target.files[0]);
      // formik.setFieldValue("pic", event.target.files[0]);
    }
  };
  function handleNoBatch(e) {
    onNoBatchOpen();
    setSelectedNoBatch(JSON.parse(e.target.value));
    console.log(selectedNoBatch, "HANDLE NOMOR BATCH");
  }

  async function patchNoBatch() {
    const formData = new FormData();
    formData.append("noBatchFE", selectedNoBatch.noBatch);
    formData.append("id", selectedNoBatch.id);
    formData.append("pic", selectedFile);
    formData.append("exp", selectedNoBatch.exp);
    formData.append("harga", selectedNoBatch.harga);
    formData.append("kotak", selectedNoBatch.kotak);

    await axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/edit`,
        formData
      )
      .then((res) => {
        onNoBatchClose();
        setSelectedNoBatch({});
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function renderNoBatch() {
    return dataNoBatch.map((val) => {
      return (
        <option
          key={val.id}
          value={JSON.stringify({
            id: val.id,
            noBatch: val.noBatch,
            harga: val.harga,
            exp: val.exp,
            kotak: val.kotak,
            pic: val.pic,
          })}
        >
          {val.noBatch}
        </option>
      );
    });
  }
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
        setDataNoBatch(res.data.result.noBatches);
        setRiwayatData(res.data.getRiwayat);
        setEditedData({
          id: res.data.result.id,
          nama: res.data.result.nama,
          kategori: {
            id: res.data.result.kategori.id,
            nama: res.data.result.kategori.nama,
          },

          aplikasi: {
            id: res?.data?.result?.aplikasi?.id || 0,
            nama: res?.data?.result?.aplikasi?.nama,
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
        kategoriFE: editedData.kategori || originalData.kategori,
        satuanFE: editedData.satuan || originalData.satuan.id,
        kelasterapiFE: editedData.kelasterapi || originalData.kelasterapi.id,
        aplikasiFE: editedData.aplikasi || originalData.aplikasi.id,
        kode: editingColumn,
        profileId,
      })
      .then((res) => {
        console.log(res.data, "TTTTTTTTTTTTTTs");
        setEditingColumn(null);
        fetchData();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSaveClick = () => {
    patchObat();
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
        <Box
          bgColor={"secondary"}
          py={"50px"}
          mt={"50px"}
          backgroundImage={`url(${Batik})`}
        >
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
                  <Tr>
                    <Th>Aplikasi</Th>
                    <Td>
                      {editingColumn === "aplikasi" ? (
                        <Select
                          value={editedData.aplikasi?.id}
                          onChange={(e) =>
                            handleSelectChange("aplikasi", e.target.value)
                          }
                        >
                          <option value="">Pilih Kelas Terapi</option>
                          {dataSeeder.aplikasiSeed &&
                            dataSeeder.aplikasiSeed.map((aplikasi) => (
                              <option key={aplikasi?.id} value={aplikasi?.id}>
                                {aplikasi?.nama}
                              </option>
                            ))}
                        </Select>
                      ) : (
                        editedData.aplikasi?.nama || "Tidak ada Aplikasi"
                      )}
                    </Td>
                    <Td>
                      {editingColumn === "aplikasi" ? (
                        <>
                          <Button onClick={handleSaveClick}>Simpan</Button>
                          <Button onClick={handleCancelClick}>Batal</Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEditClick("aplikasi")}
                          isDisabled={!editedData?.aplikasi?.nama}
                        >
                          Edit
                        </Button>
                      )}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Container>
          <Container
            mt={"30px"}
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <FormControl>
              <FormLabel>NoBatch</FormLabel>
              <Select
                mt="10px"
                border="1px"
                placeholder="Pilih Nomor batch"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  handleNoBatch(e);
                }}
              >
                {renderNoBatch()}
              </Select>
            </FormControl>
          </Container>
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

        <Modal isOpen={isNoBatchOpen} onClose={onNoBatchClose}>
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>Ubah Data Nomor batch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Input
                  onChange={handleFile}
                  ref={inputFileRef}
                  accept="image/png, image/jpeg"
                  display="none"
                  type="file"

                  // hidden="hidden"
                />
              </FormControl>
              <FormControl>
                <Image
                  src={
                    selectedNoBatch?.pic
                      ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                        selectedNoBatch.pic
                      : addFoto
                  }
                  id="imgpreview"
                  alt="Room image"
                  width="100%"
                  height={{ ss: "210px", sm: "210px", sl: "650px" }}
                  me="10px"
                  mt="20px"
                  overflow="hiden"
                  objectFit="cover"
                />
              </FormControl>
              <FormControl mt="20px">
                <FormHelperText>Max size: 1MB</FormHelperText>
                <Button w="100%" onClick={() => inputFileRef.current.click()}>
                  Add Photo
                </Button>
                {fileSizeMsg ? (
                  <Alert status="error" color="red" text="center">
                    {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                    <Text ms="10px">{fileSizeMsg}</Text>
                  </Alert>
                ) : null}
              </FormControl>
              <FormControl>
                <FormLabel>No Batch</FormLabel>
                <Input
                  value={selectedNoBatch.noBatch}
                  onChange={(e) =>
                    setSelectedNoBatch({
                      ...selectedNoBatch,
                      noBatch: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>harga</FormLabel>
                <Input
                  value={selectedNoBatch.harga}
                  onChange={(e) =>
                    setSelectedNoBatch({
                      ...selectedNoBatch,
                      harga: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Kotak</FormLabel>
                <Input
                  value={selectedNoBatch.kotak}
                  onChange={(e) =>
                    setSelectedNoBatch({
                      ...selectedNoBatch,
                      kotak: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>EXP</FormLabel>
                <Input
                  type="date"
                  value={
                    selectedNoBatch.exp ? selectedNoBatch.exp.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    setSelectedNoBatch({
                      ...selectedNoBatch,
                      exp: e.target.value,
                    })
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onNoBatchClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={patchNoBatch}>
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
