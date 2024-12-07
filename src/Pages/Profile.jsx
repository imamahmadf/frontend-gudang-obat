import React, { useState, useEffect, useRef } from "react";
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
  Flex,
  Image,
  Avatar,
  ModalCloseButton,
  Container,
  Spacer,
  FormControl,
  FormLabel,
  Input,
  Alert,
  FormHelperText,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import FotoHome from "../assets/GFK.jpeg";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../Components/Layout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import addFoto from "./../assets/add_photo.png";

function Profile() {
  const { id, ProfilePic, ProfileName, firebaseProviderId, UserRoles } =
    useSelector((state) => state.user);
  const inputFileRef = useRef(null);
  const [dataprofile, setDataProfile] = useState(null);
  const [nama, setNama] = useState("");
  const [pic, setPic] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [nip, setNip] = useState("");
  const [old_img, setOld_img] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeMsg, setFileSizeMsg] = useState("");

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isEditFotoOpen,
    onOpen: onEditFotoOpen,
    onClose: onEditFotoClose,
  } = useDisclosure();

  const handleFile = (event) => {
    if (event.target.files[0].size / 1024 > 1024) {
      setFileSizeMsg("File size is greater than maximum limit");
    } else {
      setSelectedFile(event.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(event.target.files[0]);
      setFileSizeMsg("");
    }
  };

  async function postFotoProfile() {
    console.log("cekkk");
    const formData = new FormData();

    formData.append("old_img", old_img || "");
    formData.append("pic", selectedFile);
    await axios
      .patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/patch/foto`,
        formData
      )
      .then((res) => {
        console.log(res.data);
        onEditClose();
        fetchDataProfile();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const formik = useFormik({
    initialValues: {
      nama,
      jabatan,
      nip,
      tanggalLahir,
    },

    validationSchema: Yup.object().shape({
      nama: Yup.string().required("nama tidak boleh kosong"),
      jabatan: Yup.string().required("jabatan tidak boleh kosong"),

      nip: Yup.number().required("nip tidak boleh kosong"),
      tanggalLahir: Yup.string().required("tanggal lahri tidak boleh kosong"),
    }),
    validateOnChange: false,

    onSubmit: async (value) => {
      const { nama, jabatan, nip, tanggalLahir } = value;

      await axios
        .patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/patch`, {
          nama,
          jabatan,
          nip,
          tanggalLahir,
          userId: id,
        })
        .then(async (res) => {
          console.log(res.data);
          onEditClose();
          fetchDataProfile();
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });
  async function fetchDataProfile() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/get/${id}`)
      .then((res) => {
        setDataProfile(res.data.result);
        setOld_img(res.data.result.profilePic);
        formik.values.nama = res.data.result.nama;
        formik.values.jabatan = res.data.result.jabatan;
        formik.values.nip = res.data.result.nip;
        formik.values.tanggalLahir = res.data.result.birthdate.split("T")[0];

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchDataProfile();
  }, []);
  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
          <Container
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <Flex>
              <Box position="relative">
                <Avatar
                  size="lx"
                  objectFit={"cover"}
                  overflow="hidden"
                  my="auto"
                  borderRadius={"5px"}
                  src={import.meta.env.VITE_REACT_APP_API_BASE_URL + ProfilePic}
                />
                <Button
                  position="absolute"
                  bottom={0}
                  right={0}
                  colorScheme="teal"
                  onClick={onEditFotoOpen}
                >
                  Edit Foto
                </Button>
              </Box>
              <Box ms={"20px"}>
                <Text fontSize={"30px"} fontWeight={700}>
                  {dataprofile?.nama}
                </Text>
                <Text>Jabatan: {dataprofile?.jabatan}</Text>
                <Text>NIP. : {dataprofile?.nip}</Text>
                <Text>Tanggal Lahir : {dataprofile?.birthdate}</Text>
                <Text>Email: {dataprofile?.user.email}</Text>
              </Box>
              <Spacer />
              <Box>
                <Button onClick={onEditOpen}>Edit</Button>
              </Box>
            </Flex>
          </Container>
        </Box>
      </Layout>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isEditFotoOpen}
        onClose={onEditFotoClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxW="800px" p={"10px"}>
          <ModalHeader>Shory by:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
          <Image
            src={
              ProfilePic
                ? import.meta.env.VITE_REACT_APP_API_BASE_URL + ProfilePic
                : addFoto
            }
            alt="Room image"
            id="imgpreview"
            width="100%"
            height={{ ss: "210px", sm: "210px", sl: "650px" }}
            me="10px"
            mt="5px"
            mb="20px"
            overflow="hiden"
            objectFit="cover"
          />
          <FormControl my="20px">
            <FormHelperText>Max size: 1MB</FormHelperText>
            <Button
              variant="primary"
              w="100%"
              onClick={() => inputFileRef.current.click()}
            >
              Edit Photo
            </Button>
            {fileSizeMsg ? (
              <Alert status="error" color="red" text="center">
                <i className="fa-solid fa-circle-exclamation"></i>
                <Text ms="10px">{fileSizeMsg}</Text>
              </Alert>
            ) : null}
          </FormControl>{" "}
          <FormControl>
            <Input
              onChange={handleFile}
              ref={inputFileRef}
              accept="image/png, image/jpeg"
              display="none"
              type="file"
            />
          </FormControl>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                postFotoProfile();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0}>
          <ModalHeader>Shory by:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl pb="20px">
              <FormLabel>Nama</FormLabel>
              <Input
                mt={"10px"}
                type="text"
                placeholder="nama"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                value={formik.values.nama}
                onChange={(e) => {
                  formik.setFieldValue("nama", e.target.value);
                }}
              />
              {formik.errors.nama ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.nama}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Jabatan</FormLabel>
              <Input
                mt={"10px"}
                type="text"
                placeholder="jabatan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                value={formik.values.jabatan}
                onChange={(e) => {
                  formik.setFieldValue("jabatan", e.target.value);
                }}
              />
              {formik.errors.jabatan ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.jabatan}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>NIP</FormLabel>
              <Input
                mt={"10px"}
                type="text"
                placeholder="nip"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                value={formik.values.nip}
                onChange={(e) => {
                  formik.setFieldValue("nip", e.target.value);
                }}
              />
              {formik.errors.nip ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.nip}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Tanggal Lahir</FormLabel>
              <Input
                mt={"10px"}
                type="date"
                placeholder="tanggal lahir"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                value={formik.values.tanggalLahir}
                onChange={(e) => {
                  formik.setFieldValue("tanggalLahir", e.target.value);
                }}
              />
              {formik.errors.tanggalLahir ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.tanggalLahir}</Text>
                </Alert>
              ) : null}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                console.log("Submit button clicked");
                formik.handleSubmit();
              }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Profile;
