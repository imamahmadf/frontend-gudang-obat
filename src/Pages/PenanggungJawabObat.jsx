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

function PenanggungJawabObat() {
  const [dataPenanggungJawab, setDataPenanggungJawab] = useState([]);
  async function fetchDataPenanggungJawabObat() {
    axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get/penanggung-jawab`
      )
      .then((res) => {
        console.log(res.data.result);
        setDataPenanggungJawab(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    fetchDataPenanggungJawabObat();
  }, []);

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
          {JSON.stringify(dataPenanggungJawab)}
        </Container>
      </Box>
    </Layout>
  );
}

export default PenanggungJawabObat;
