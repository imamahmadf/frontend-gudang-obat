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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import { Link, useHistory } from "react-router-dom";
import Batik from "../assets/BATIK.png";
import Layout from "../Components/Layout";
function DaftarAlokasi() {
  const history = useHistory();
  const [dataAlokasi, setDataAlokasi] = useState([]);

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

  async function fetchDaftarAlokasi() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/get/all/alokasi`
      )
      .then((res) => {
        console.log(res.data);
        setDataAlokasi(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDaftarAlokasi();
  }, []);

  return (
    <>
      <Layout>
        <Box
          backgroundImage={`url(${Batik})`}
          pt={"80px"}
          bgColor={"rgba(249, 250, 251, 1)"}
        >
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
            <Box style={{ overflowX: "auto" }}>
              <Table>
                <Thead>
                  <Tr>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      no.
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Tanggal
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Nama
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataAlokasi?.map((item, index) => (
                    <Tr key={item.id}>
                      <Td borderWidth="1px" borderColor="primary">
                        {index + 1}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {formatDate(item.createdAt)}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {item.nama || "Tidak ada nama"}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        <Button
                          onClick={() => {
                            history.push(`/gfk/detail-alokasi/${item.id}`);
                          }}
                        >
                          detail
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default DaftarAlokasi;
