import React, { useEffect, useState } from "react";
import axios from "axios";
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

  async function getAmprahan() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/get/tujuan-amprahan`
      )
      .then((res) => {
        setTujuanAmprahan(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function renderNoBatch() {
    return props.data.map((val) => {
      // console.log(val);
      const newExp = formatDate(val.exp);
      return (
        <option key={val.noBatch} value={val.id}>
          {val.noBatch} - {newExp} - {val.stok}
        </option>
      );
    });
  }

  function renderTujuan() {
    return tujuanAmprahan.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.uptd.nama}
        </option>
      );
    });
  }

  const formik = useFormik({
    initialValues: {
      noBatchId: "",
      amprahanId: 0,
      //   userId: 0,
      permintaan: 0,
    },
    validationSchema: Yup.object().shape({
      noBatchId: Yup.number("masukkan angka").required("kategori wajib diisi"),
      amprahanId: Yup.number("masukkan angka").required("satuanId wajib diisi"),
      permintaan: Yup.number("masukkan angka").required("satuanId wajib diisi"),
    }),
    validateOnChange: false,

    onSubmit: async (values) => {
      // console.log(values, "tes formik");
      const { noBatchId, amprahanId, permintaan } = values;
      const stokAwal = props.data.find((objek) => objek.id === noBatchId);

      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/amprahan/post/amprahan-item?noBatchId=${noBatchId}&userId=1&amprahanId=${amprahanId}&permintaan=${permintaan}&stokAwal=${
            stokAwal.stok
          }&obatId=${props.id}`
        )
        .then((res) => {
          alert(res.data.message);
          setTimeout(() => {
            history.push("/daftar-obat");
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  useEffect(() => {
    getAmprahan();
  }, []);
  return (
    <Box>
      <Tooltip label="Delete Property" aria-label="A tooltip">
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
          <ModalHeader>Shory by:</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6} name="time">
            {" "}
            <FormControl>
              <FormLabel>Tujuan Amprahan</FormLabel>
              <Select
                mt="10px"
                placeholder="Tujuan Amprahan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("amprahanId", parseInt(e.target.value));
                }}
              >
                {renderTujuan()}
              </Select>
              {formik.errors.amprahanId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.amprahanId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl>
              <FormLabel>Pilih Nomor Batch</FormLabel>
              <Select
                mt="10px"
                placeholder="Nomor batch"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("noBatchId", parseInt(e.target.value));
                }}
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
                onChange={(e) => {
                  formik.setFieldValue("permintaan", e.target.value);
                }}
              />{" "}
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
