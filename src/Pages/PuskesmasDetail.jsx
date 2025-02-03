import React, { useEffect, useState } from "react";
import { Box, Text, Image, Container, Flex, Spacer } from "@chakra-ui/react";
import axios from "axios";

function PuskesmasDetail(props) {
  const [dataObat, setDataObat] = useState([]);
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

  async function fetchData() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas-detail/${
          props.match.params.id
        }`
      )
      .then((res) => {
        setDataObat(res.data.result);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box>
      <Text display={{ ss: "block", sl: "none" }}>cek aja ya</Text>
      <Box>ini puskesmas {props.match.params.id}</Box>
    </Box>
  );
}

export default PuskesmasDetail;
