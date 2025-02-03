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

import { useFormik } from "formik";
import * as Yup from "yup";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { BsPencilFill } from "react-icons/bs";

import { BsTrash3 } from "react-icons/bs";

function AdminEditAmprahan(props) {
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

  function hapusAmprahanItem(val) {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin/delete`, {
        id: props.data.id,
      })
      .then((res) => {
        props.randomNumber(Math.random());
        // console.log(res.data);
        onDeleteClose();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const formikAmprahanItem = useFormik({
    initialValues: {
      sisa: props.data.sisa,
      permintaan: props.data.permintaan,
    },
    validationSchema: Yup.object().shape({
      sisa: Yup.number("masukkan angka").required("sisa wajib diisi"),
      permintaan: Yup.number("masukkan angka").required(
        "permintaan wajib diisi"
      ),
    }),

    onSubmit: async (values) => {
      const { sisa, permintaan } = values;
      await axios
        .patch(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/admin/edit/amprahan-item`,
          {
            sisa,
            permintaan,
            id: props.data.id,
          }
        )
        .then((res) => {
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
    <Flex gap={4}>
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
      <Center
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
        bg="red"
        onClick={onDeleteOpen}
      >
        <BsTrash3 />
      </Center>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isDeleteOpen}
        onClose={() => {
          onDeleteClose();
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader>{props.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={"10px"}>
              {" "}
              Apakah anda yakin ingin menghapus Data ini?
            </Text>
            <Table>
              <Tbody>
                <Tr>
                  <Td>Obat</Td>
                  <Td>: {props.data.noBatch.obat.nama}</Td>
                </Tr>
                <Tr>
                  <Td>No. Batch</Td>
                  <Td>: {props.data.noBatch.noBatch}</Td>
                </Tr>
                <Tr>
                  <Td>Permintaan</Td>
                  <Td>: {props.data.permintaan}</Td>
                </Tr>
                <Tr>
                  <Td>
                    {props.data.amprahan.uptd.statusTujuanId == 1
                      ? "Tujuan"
                      : "asal"}
                  </Td>
                  <Td>: {props.data.amprahan.uptd.nama}</Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            {" "}
            <Button
              bgColor={"danger"}
              color={"white"}
              onClick={() => {
                hapusAmprahanItem();
              }}
            >
              <BsTrash3 /> Delete
            </Button>{" "}
            <Text>{JSON.stringify(props.sisa)}</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
            <Text>{JSON.stringify(props.data.id)}</Text>
            <FormControl>
              <Input
                mt={"10px"}
                type="number"
                placeholder="stok"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                defaultValue={props.data.sisa}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  formikAmprahanItem.setFieldValue("sisa", value);
                }}
              />{" "}
              {formikAmprahanItem.errors.sisa ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formikAmprahanItem.errors.sisa}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl>
              <Input
                mt={"10px"}
                type="number"
                placeholder="permintaan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                defaultValue={props.data.permintaan}
                onChange={(e) => {
                  formikAmprahanItem.setFieldValue(
                    "permintaan",
                    e.target.value
                  );
                }}
              />{" "}
              {formikAmprahanItem.errors.permintaan ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formikAmprahanItem.errors.permintaan}</Text>
                </Alert>
              ) : null}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            {" "}
            <Button
              w="100%"
              mb="40px"
              onClick={formikAmprahanItem.handleSubmit}
            >
              Edit
            </Button>{" "}
            <Text>{JSON.stringify(props.sisa)}</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminEditAmprahan;
