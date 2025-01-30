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
  FormControl,
  FormLabel,
  Center,
  HStack,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import Batik from "../assets/BATIK.png";
import axios from "axios";
import Layout from "../Components/Layout";
function Statistik() {
  return (
    <>
      <Layout>
        <Box
          backgroundImage={`url(${Batik})`}
          pt={"80px"}
          pb={"40px"}
          minHeight={{ ss: "300px", sl: "800px" }}
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
            ssssss
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Statistik;
