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
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import Layout from "../Components/Layout";

function EditObat(props) {
  const [dataObat, setDataObat] = useState([]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  async function deletBtnHandlerObat(val) {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/delete`, {
        old_img: dataObat.pic,
        id: props.match.params.obatId,
      })
      .then(() => {
        alert("wwww");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  async function fetchData() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/obat/edit/${
          props.match.params.obatId
        }`
      )
      .then((res) => {
        console.log(res.data);
        setDataObat(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  useEffect(() => {
    fetchData();
    //console.log(bank);
  }, []);
  console.log(dataObat.pic);
  return (
    <>
      <Layout>
        <Box height={"800px"} pt={"80px"}>
          <Text>{props.match.params.obatId}</Text>
          <Text>TESSSSS</Text>
          <Button onClick={onDeleteOpen}>reee</Button>
        </Box>
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>aaaaa</ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  deletBtnHandlerObat();
                }}
                variant="ghost"
              >
                Secondary Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default EditObat;
