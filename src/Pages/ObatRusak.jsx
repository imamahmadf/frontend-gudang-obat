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
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
function ObatRusak() {
  const history = useHistory();
  const { profileId } = useSelector((state) => state.user);
  const [status, setStatus] = useState([]);
  const [dataObatRusak, setDataObatRusak] = useState([]);

  const {
    isOpen: isRusakOpen,
    onOpen: onRusakOpen,
    onClose: onRusakClose,
  } = useDisclosure();
  async function OpenObatRusak() {
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rusak/post/open-rusak`,
        { profileId }
      )
      .then((res) => {
        history.push(`/gfk/daftar-obat`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function closeObatRusak() {
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/rusak/post/close-rusak?id=${status.id}`
      )
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  }
  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        console.log(res.data[0], "STATUSSSS");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  async function fetchObatRusak() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/rusak/get`)
      .then((res) => {
        console.log(res.data.result);
        setDataObatRusak(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchStatus();
    fetchObatRusak();
  }, []);
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
            <Button onClick={onRusakOpen}>tambah Obat Rusak</Button>
            <Button onClick={closeObatRusak}>Tutup Obat Rusak</Button>
            {JSON.stringify(status)}

            <Table variant="simple" mt={4}>
              <Thead>
                <Tr>
                  <Th>No Batch</Th>
                  <Th>Nama Obat</Th>
                  <Th>Harga</Th>
                  <Th>Stok</Th>
                  <Th>EXP</Th>
                  <Th>Catatan</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataObatRusak?.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.noBatch.noBatch}</Td>
                    <Td>{item.noBatch.obat.nama}</Td>
                    <Td>{item.noBatch.harga}</Td>
                    <Td>{item.permintaan}</Td>
                    <Td>{new Date(item.exp).toLocaleDateString()}</Td>
                    <Td>{item.catatan}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Container>
        </Box>
        <Modal
          closeOnOverlayClick={false}
          isOpen={isRusakOpen}
          onClose={onRusakClose}
        >
          <ModalOverlay />
          <ModalContent borderRadius={0}>
            <ModalHeader>Shory by:</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text></Text>
            </ModalBody>

            <ModalFooter>
              <Button
                height={"20px"}
                width={"60px"}
                fontSize={"12px"}
                onClick={() => {
                  OpenObatRusak();
                }}
              >
                Terima
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default ObatRusak;
