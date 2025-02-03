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
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { BsPencilFill } from "react-icons/bs";
import { BsCartXFill } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";

function AdminEditNoBatch(props) {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const formik = useFormik({
    initialValues: {
      stok: props.data.stok,
    },
    validationSchema: Yup.object().shape({
      stok: Yup.number("masukkan angka").required("stok wajib diisi"),
    }),

    onSubmit: async (values) => {
      const { stok } = values;
      await axios
        .patch(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin/edit/no-batch`,
          {
            stok,
            id: props.data.id,
          }
        )
        .then((res) => {
          ///////////
          // console.log(res.data);
          props.randomNumber(Math.random());
          onEditClose();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });
  return (
    <Box>
      <Center
        onClick={onEditOpen}
        borderRadius={"5px"}
        as="button"
        h="25px"
        w="25px"
        fontSize="15px"
        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
        color="white"
        _hover={{
          bg: "black",
        }}
        bg="green"
      >
        <BsPencilFill />
      </Center>{" "}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader>{props.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {" "}
            <Text>{JSON.stringify(props.data)}</Text>
            <FormControl>
              <Input
                mt={"10px"}
                type="number"
                placeholder="stok"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                defaultValue={props.data.stok}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  formik.setFieldValue("stok", value);
                }}
              />{" "}
              {formik.errors.stok ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.stok}</Text>
                </Alert>
              ) : null}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {" "}
            <Button w="100%" mb="40px" onClick={formik.handleSubmit}>
              Edit
            </Button>{" "}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminEditNoBatch;
