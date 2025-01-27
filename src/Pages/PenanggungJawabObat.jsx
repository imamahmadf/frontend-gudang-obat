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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Select,
  Center,
  Checkbox,
  SimpleGrid,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

function PenanggungJawabObat() {
  const [dataPenanggungJawab, setDataPenanggungJawab] = useState([]);
  const [penanggungJawabProfile, setPenanggungjawabProfile] = useState(0);
  const [gantiPenanggungJawab, setGantiPenanggungjawab] = useState(0);
  const [profile, setProfile] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [dataKategori, setDatakategori] = useState([]);
  const [kategoriId, setKategoriId] = useState(0);
  const {
    isOpen: isPenanggungJawabOpen,
    onOpen: onPenanggungJawabOpen,
    onClose: onPenanggungJawabClose,
  } = useDisclosure();
  function patchPenanggungJawab() {
    axios
      .patch(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/patch/penanggung-jawab`,
        { selectedIds, profileId: gantiPenanggungJawab }
      )
      .then((res) => {
        console.log(res.data, "VEK!@##", selectedIds, gantiPenanggungJawab);
      });
  }

  async function fetchDataPenanggungJawabObat() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get/penanggung-jawab?profileId=${penanggungJawabProfile}&kategoriId=${kategoriId}`
      )
      .then((res) => {
        console.log(res.data.result, penanggungJawabProfile);
        setDataPenanggungJawab(res.data.result);
        setDatakategori(res.data.dataKategori);
        setAllChecked(false);
        setSelectedIds([]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchProfile() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/user/get-profile/penanggung-jawab`
      )
      .then((res) => {
        console.log(res.data.result);
        setProfile(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function renderProfile() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  function renderKategori() {
    return dataKategori?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderGantiPenanggugnJawab() {
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  const handleCheckboxChange = (id) => {
    const updatedCheckedItems = [...checkedItems];
    const index = dataPenanggungJawab.findIndex((item) => item.id === id);

    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);

    if (updatedCheckedItems[index]) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }

    setAllChecked(updatedCheckedItems.every(Boolean));
  };

  const handleAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setCheckedItems(new Array(dataPenanggungJawab.length).fill(checked));
    setAllChecked(checked);
    setSelectedIds(checked ? dataPenanggungJawab.map((item) => item.id) : []);
  };

  useEffect(() => {
    fetchDataPenanggungJawabObat();
    fetchProfile();
  }, [penanggungJawabProfile, kategoriId]);

  return (
    <Layout>
      <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
        <Container
          mt={"30px"}
          maxW={"1280px"}
          bgColor={"white"}
          borderRadius={"5px"}
          p={"30px"}
        >
          {" "}
          <FormControl mb={"20px"}>
            {" "}
            <FormLabel>Pilih Penanggung Jawab</FormLabel>
            <Select
              placeholder="Penanggungjawab"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : 0;
                setPenanggungjawabProfile(value);
              }}
            >
              {renderProfile()}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Pilih Kategori</FormLabel>
            <Select
              placeholder="Kategori"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : 0;
                setKategoriId(value);
              }}
            >
              {renderKategori()}
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
          <Box
            borderRadius={"5px"}
            p={"10px"}
            bgColor={"secondary"}
            my={"20px"}
            border={"1px"}
            borderColor={"primary"}
            width={{ ss: "100%", sl: "32%" }}
          >
            <Checkbox isChecked={allChecked} onChange={handleAllCheckboxChange}>
              Centang Semua
            </Checkbox>
          </Box>
          <Box>
            <SimpleGrid minChildWidth="300px" columns={2} spacing={5}>
              {dataPenanggungJawab.map((item, index) => (
                <Box
                  borderRadius={"5px"}
                  p={"10px"}
                  bgColor={"secondary"}
                  key={item.id}
                >
                  <Checkbox
                    colorScheme="green"
                    isChecked={checkedItems[index] || false}
                    onChange={() => handleCheckboxChange(item.id)}
                  >
                    {item.nama}
                  </Checkbox>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Box mt={"20px"}>
            {penanggungJawabProfile ? (
              <Button
                w={"100%"}
                variant={"primary"}
                onClick={onPenanggungJawabOpen}
              >
                ganti
              </Button>
            ) : null}
          </Box>
        </Container>
      </Box>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isPenanggungJawabOpen}
        onClose={onPenanggungJawabClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader>Shory by:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>ss</Text>
            <Select
              placeholder="Penanggungjawab"
              border="1px"
              borderRadius={"8px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              onChange={(e) => {
                setGantiPenanggungjawab(parseInt(e.target.value));
              }}
            >
              {renderGantiPenanggugnJawab()}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={patchPenanggungJawab}
              height={"20px"}
              width={"60px"}
              fontSize={"12px"}
            >
              Terima
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default PenanggungJawabObat;
