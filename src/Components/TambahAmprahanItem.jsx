import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { BsCart4 } from "react-icons/bs";
import {
  Box,
  Center,
  Container,
  Text,
  Image,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  HStack,
  Input,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Tooltip,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Alert,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useDisclosure } from "@chakra-ui/react";
function TambahAmprahanItem(props) {
  // console.log(props, "PROPPPPSSSSSSSSSSS");
  const {
    isOpen: isAmprahanOpen,
    onOpen: onAmprahanOpen,
    onClose: onAmprahanClose,
  } = useDisclosure();
  const [tujuanAmprahan, setTujuanAmprahan] = useState([]);
  const [tujuan, setTujuan] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(props.data[0] || null);

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

  async function statusAmprahan() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        console.log(res.data);
        setTujuan(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function getAmprahan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/get/tujuan-amprahan`
      )
      .then((res) => {
        setTujuanAmprahan(res.data);
        console.log(res.data, "TUJUAJN APRHANNN");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function renderNoBatch() {
    return props.data.map((val) => {
      // console.log(val);
      return (
        <option key={val.noBatch} value={val.id}>
          {val.noBatch}
        </option>
      );
    });
  }

  const handleBatchChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = props.data.find((val) => val.id === selectedId);
    setSelectedBatch(selected);
    formik.setFieldValue("noBatchId", selectedId);
  };

  const validationSchema = Yup.object().shape({
    noBatchId: Yup.number("masukkan angka").required("kategori wajib diisi"),
    amprahanId: Yup.number("masukkan angka").required("satuanId wajib diisi"),
    permintaan: Yup.number("masukkan angka")
      .required("satuanId wajib diisi")
      .max(
        selectedBatch ? selectedBatch.stok : Infinity,
        `Stok tidak boleh melebihi ${selectedBatch ? selectedBatch.stok : 0}`
      ),
  });

  const formik = useFormik({
    initialValues: {
      noBatchId: "",
      amprahanId: 0,
      //   userId: 0,
      permintaan: 0,
    },
    validationSchema: validationSchema,
    validateOnChange: false,

    onSubmit: async (values) => {
      // console.log(values, "tes formik");
      const { noBatchId, amprahanId, permintaan } = values;
      const stokAwal = props.data.find((objek) => objek.id === noBatchId);

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/amprahan/post/amprahan-item?noBatchId=${noBatchId}&userId=1&amprahanId=${
            tujuan[0]?.id
          }&permintaan=${permintaan}&stokAwal=${stokAwal.stok}&obatId=${
            props.id
          }`
        )
        .then((res) => {
          // alert(res.data.message, "wah berhasil");
          onAmprahanClose();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  useEffect(() => {
    getAmprahan();
    statusAmprahan();
    if (props.data.length > 0) {
      setSelectedBatch(props.data[0]);
      formik.setFieldValue("noBatchId", props.data[0].id);
    }
  }, [props.data]);
  return (
    <Box>
      <Tooltip label="amprahan/bon" aria-label="A tooltip">
        <Center
          onClick={onAmprahanOpen}
          borderRadius={"5px"}
          as="button"
          h="25px"
          w="25px"
          fontSize="12px"
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          color="white"
          _hover={{
            bg: "black",
          }}
          bg="green"
          // onClick={onOpen}
        >
          <BsCart4 />
        </Center>
      </Tooltip>{" "}
      {/* ////////// amprahan//////////// */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isAmprahanOpen}
        onClose={onAmprahanClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader>Tujuan:{tujuan[0]?.uptd?.nama}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6} name="time">
            {" "}
            <FormControl>
              {/* //////// */}

              {/* /////// */}
            </FormControl>{" "}
            {selectedBatch && (
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>EXP</Th>
                    <Th>Stok</Th>
                    <Th>Kotak</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{formatDate(selectedBatch.exp)}</Td>
                    <Td>{selectedBatch.stok}</Td>
                    <Td>{selectedBatch.kotak}</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
            <FormControl>
              <FormLabel>Pilih Nomor Batch</FormLabel>
              <Select
                mt="10px"
                placeholder="Nomor batch"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={handleBatchChange}
                value={selectedBatch ? selectedBatch.id : ""}
              >
                {renderNoBatch()}
              </Select>
              {formik.errors.noBatchId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.noBatchId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Stok</FormLabel>
              <Input
                mt={"10px"}
                type="number"
                placeholder="stok"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                max={selectedBatch ? selectedBatch.stok : undefined}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  formik.setFieldValue("permintaan", value);
                }}
                value={formik.values.permintaan}
              />
              {formik.errors.permintaan ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.permintaan}</Text>
                </Alert>
              ) : null}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={formik.handleSubmit}
              variant="primary"
              borderRadius={0}
              colorScheme="red"
              mr={0}
              w="100%"
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TambahAmprahanItem;
