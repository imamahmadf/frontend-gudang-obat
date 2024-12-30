import React, { useEffect, useState } from "react";
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
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
function ObatUser(props) {
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [namaPuskesmas, setNamaPuskesmas] = useState([]);
  const [puskesmasId, setPuskesmasId] = useState(0);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  function selectHandler(event, field) {
    const { value } = event.target;
    if (field === "puskesmasId") {
      setPuskesmasId(value);
      // console.log(value);
    }
  }
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  const handleChange = (e, field) => {
    //console.log(field);
    const { value } = e.target;
    if (field === "startDate") {
      setInputStartDate(value);
    } else if (field === "endDate") {
      setInputEndDate(value);
    }
  };
  async function fetchNamaPuskesmas() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas`)
      .then((res) => {
        setNamaPuskesmas(res.data.result);
        // console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  function renderPuskesmas() {
    // console.log(puskesmas);
    return namaPuskesmas?.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  async function fetchDataObat() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/get/obat-profile/${
          props?.match?.params?.profi
        }`
      )
      .then((res) => {
        console.log(res.data, "INI DATA DARI OBAT USER");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchNamaPuskesmas();
    fetchDataObat();
  }, [inputStartDate, inputEndDate, puskesmasId]);

  return (
    <Box>
      <Layout>
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
          <Container
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            {props.match.params.profileId}
            <FormControl>
              <Select
                mb="20px"
                placeholder="Berdasarkan Tujuan"
                borderRadius={0}
                onClick={(e) => selectHandler(e, "puskesmasId")}
              >
                {renderPuskesmas()}
              </Select>
            </FormControl>
          </Container>
        </Box>
      </Layout>
    </Box>
  );
}

export default ObatUser;
