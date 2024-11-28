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
} from "@chakra-ui/react";
import FotoHome from "../assets/GFK.jpeg";

import Layout from "../Components/Layout";

function Home() {
  return (
    <>
      <Layout>
        <Box
          // backgroundImage={FotoHome}
          overflow="hiden"
          objectFit="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          height={"100vh"}
          w="100%"
        >
          <Container pt={"300px"} height={"1000px"} maxW={"1280px"}>
            <Text>INI HOME</Text>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Home;
