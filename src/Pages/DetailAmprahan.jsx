import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Container,
  Flex,
  Spacer,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Layout from "../Components/Layout";

function DetailAmprahan(props) {
  const [detailAmprahan, setDetailAmprahan] = useState([]);
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

  const newTanggal = formatDate(detailAmprahan?.tanggal);
  async function fetchDetailAmprahan() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/detail/${
          props.match.params.amprahanId
        }`
      )
      .then((res) => {
        console.log(res.data.result);
        setDetailAmprahan(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    fetchDetailAmprahan();
  }, []);

  function renderItemAmprahan() {
    console.log(detailAmprahan, "DETAIL");
    return detailAmprahan?.amprahanItems?.map((val, idx) => {
      const newExp = formatDate(val.noBatch.exp);
      console.log(val, "aaaaaxxx");
      return (
        <Box key={idx}>
          <Center
            py={"10px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
          >
            <Text width={"190px"} me={"10px"}>
              {val.noBatch.obat.nama}
            </Text>
            <Text width={"100px"} me={"10px"}>
              {val.noBatch.noBatch}
            </Text>
            <Text me={"10px"} width={"80px"}>
              {newExp}
            </Text>
            <Text me={"10px"} width={"80px"}>
              {val.noBatch.obat.satuan.nama}
            </Text>
            <Text me={"10px"} width={"80px"}>
              {val.permintaan}
            </Text>
          </Center>
        </Box>
      );
    });
  }

  return (
    <Layout>
      <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
        <Container
          bgColor={"white"}
          borderRadius={"5px"}
          border={"1px"}
          borderColor={"rgba(229, 231, 235, 1)"}
          maxW={"1280px"}
          p={"30px"}
        >
          <Text fontSize={"20px"} fontWeight={600}>
            {" "}
            Puskesmas: {detailAmprahan?.uptd?.nama}
          </Text>
          <Text fontSize={"20px"} fontWeight={600}>
            {" "}
            Tanggal: {newTanggal}
          </Text>
          <Center
            borderTop={"1px"}
            borderBottom={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            py={"10px"}
          >
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"190px"}
              me={"10px"}
            >
              Nama
            </Text>
            <Text
              fontSize={"15px"}
              fontWeight={600}
              width={"100px"}
              me={"10px"}
            >
              Nomor Batch
            </Text>{" "}
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
              EXP
            </Text>{" "}
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
              Satuan
            </Text>{" "}
            <Text fontSize={"15px"} fontWeight={600} width={"80px"} me={"10px"}>
              Permintaan
            </Text>{" "}
          </Center>
          {renderItemAmprahan()}
        </Container>
      </Box>
    </Layout>
  );
}

export default DetailAmprahan;
