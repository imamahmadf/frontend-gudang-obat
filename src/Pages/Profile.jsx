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
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Components/Layout";

function Profile() {
  const { id, ProfilePic, ProfileName, firebaseProviderId, UserRoles } =
    useSelector((state) => state.user);
  return (
    <>
      <Layout>
        <Box
          overflow="hiden"
          objectFit="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          height={"100vh"}
          w="100%"
        >
          <Container pt={"300px"} height={"1000px"} maxW={"1280px"}>
            <Text>INI Profile</Text>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default Profile;
