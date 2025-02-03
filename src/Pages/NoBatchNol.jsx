import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Image,
  Container,
  Flex,
  Spacer,
  FormControl,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Center,
  Tr,
  Th,
  Td,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  HStack,
  VStack,
  ModalFooter,
  SimpleGrid,
  Heading,
  Alert,
  Avatar,
} from "@chakra-ui/react";
import Batik from "../assets/BATIK.png";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";

function NoBatchNol() {
  const [data, setData] = useState([]);

  async function deleteNoBatch() {
    const oldImages = data
      .map((item) => item.pic)
      .filter((pic) => pic !== null);
    const ids = data.map((item) => item.id);

    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/no-batch/delete/stok-nol`,
        {
          old_img: oldImages,
          id: ids,
        }
      )
      .then(() => {
        alert("wwww");
        fetchNoBatch();
      })
      .catch((err) => {
        console.error(err.message);
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
  async function fetchNoBatch() {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/get/stok-nol/`
      )
      .then((res) => {
        setData(res.data.result);
        // console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchNoBatch();
  }, []);
  return (
    <Layout>
      <Box
        pt={"80px"}
        bgColor={"secondary"}
        backgroundImage={`url(${Batik})`}
        pb={"40px"}
      >
        <Container
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          padding={"20px"}
          bgColor={"white"}
          mb={"20px"}
        >
          {/* Tabel untuk merender data */}
          <Box style={{ overflowX: "auto" }}>
            <Table variant="simple" size="sm" mt={2}>
              <Thead bgColor={"primary"}>
                <Tr>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    No.
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    Nama Obat
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    No. Batch
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    EXP
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    Harga
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    Kotak
                  </Th>
                  <Th fontSize={"14px"} color={"white"} py={"15px"}>
                    Stok
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((val, idx) => {
                  return (
                    <Tr key={idx}>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {idx + 1}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {val.obat.nama}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {val.noBatch}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {formatTanggal(val.exp)}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {val.harga}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {val.kotak}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary" py={"15px"}>
                        {val.stok}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>{" "}
            <Button
              onClick={() => {
                deleteNoBatch();
              }}
              variant="primary"
            >
              Hapus
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}

export default NoBatchNol;
