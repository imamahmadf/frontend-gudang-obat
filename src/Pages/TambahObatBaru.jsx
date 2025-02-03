import { useState, useRef, useEffect } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Code,
  FormErrorMessage,
  Box,
  Input,
  Text,
  Button,
  Alert,
  Select,
  FormHelperText,
  Image,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import axios from "axios";
import addFoto from "./../assets/add_photo.png";
import { BsFillFunnelFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import Layout from "../Components/Layout";
import { useDispatch, useSelector } from "react-redux";
import Batik from "../assets/BATIK.png";
function tambahObatBaru() {
  const [kelasTerapiId, setKelasTerapiId] = useState([]);
  const [kategoriId, setKategoriId] = useState([]);
  const [satuanId, setSatuanId] = useState([]);
  const [profile, setProfile] = useState([]);
  const [sumberDanaId, setSumberDanaId] = useState([]);

  const history = useHistory();
  // const [selectedFile, setSelectedFile] = useState(null);

  // const [fileSizeMsg, setFileSizeMsg] = useState("");

  // const handleFile = (event) => {
  //   if (event.target.files[0].size / 1024 > 1024) {
  //     setFileSizeMsg("File size is greater than maximum limit");
  //   } else {
  //     setSelectedFile(event.target.files[0]);
  //     let preview = document.getElementById("imgpreview");
  //     preview.src = URL.createObjectURL(event.target.files[0]);
  //     formik.setFieldValue("pic", event.target.files[0]);
  //   }
  // };

  const profileReduxId = useSelector((state) => state.user.profileId);

  YupPassword(Yup);
  //formik initialization
  const formik = useFormik({
    initialValues: {
      nama: "",
      kelasTerapiId: 0,
      kategoriId: 0,
      sumberDanaId: 0,
      satuanId: 0,
      // pic: selectedFile,
      profileId: 0,
    },
    // onSubmit: (values) => {
    //   alert(JSON.stringify(values, null, 2));
    // },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Obat wajib diisi"),

      // pic: Yup.string().required("Foto wajib diisi"),
      kelasTerapiId: Yup.number()
        .min(1, "Pilih kelas terapi")
        .required("Kelas terapi wajib disi"),
      kategoriId: Yup.number()
        .min(1, "Pilih kategori")
        .required("kategori wajib diisi"),
      satuanId: Yup.number()
        .min(1, "Pilih satuan")
        .required("satuanId wajib diisi"),

      profileId: Yup.number()
        .min(1, "Pilih profile")
        .required("profile wajib diisi")
        .typeError("profile wajib isi"),
      sumberDanaId: Yup.number()
        .min(1, "Pilih sumber dana")
        .required("sumber dana wajib diisi")
        .typeError("sumber dana wajib diisi"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // console.log(values, "tes formik");
      const {
        nama,
        kelasTerapiId,
        kategoriId,
        satuanId,
        profileId,
        sumberDanaId,
      } = values;

      // kirim data ke back-end
      await axios
        .post(
          `${
            import.meta.env.VITE_REACT_APP_API_BASE_URL
          }/obat/post?nama=${nama}&kelasTerapiId=${kelasTerapiId}&kategoriId=${kategoriId}&satuanId=${satuanId}&profileId=${profileId}&profileReduxId=${profileReduxId}&sumberDanaId=${sumberDanaId}`
        )
        .then(async (res) => {
          //console.log(res.data);
          history.push("/gfk/tambah-obat");
        })
        .catch((err) => {
          console.error(err.message);
        });
    },
  });

  async function fetchNamaObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get-nama?profileId=${0}`
      )
      .then((res) => {
        // console.log(res.data, "tessss");

        setKelasTerapiId(res.data.seederKelasTerapi);
        setKategoriId(res.data.seederKategori);
        setSatuanId(res.data.seederSatuan);
        setSumberDanaId(res.data.seedSumberDana);

        setProfile(res.data.profileStaff);
      })
      .catch((err) => {
        console.error(err.Message);
      });
  }

  function renderKelasTerapi() {
    return kelasTerapiId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderSumberDana() {
    return sumberDanaId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.sumber}
        </option>
      );
    });
  }

  function renderKategori() {
    return kategoriId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderSatuan() {
    return satuanId.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }

  function renderProfile() {
    // console.log(profile);
    return profile.map((val) => {
      return (
        <option key={val.id} value={val.id}>
          {val.nama}
        </option>
      );
    });
  }
  useEffect(() => {
    fetchNamaObat();
    // console.log(profileReduxId, "TES REDUX PROFILE ID");
  }, []);

  return (
    <>
      <Layout>
        <Box
          backgroundImage={`url(${Batik})`}
          pt={"80px"}
          pb={"40px"}
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
            {" "}
            {/* <FormControl>
              <Input
                onChange={handleFile}
                ref={inputFileRef}
                accept="image/png, image/jpeg"
                display="none"
                type="file"

                // hidden="hidden"
              />
            </FormControl> */}
            {/* <FormControl>
              <Image
                src={addFoto}
                id="imgpreview"
                alt="Room image"
                width="100%"
                height={{ ss: "210px", sm: "210px", sl: "650px" }}
                me="10px"
                mt="20px"
                overflow="hiden"
                objectFit="cover"
              />
              {formik.errors.pic ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">picture cannot be empty</Text>
                </Alert>
              ) : null}
            </FormControl> */}
            {/* <FormControl mt="20px">
              <FormHelperText>Max size: 1MB</FormHelperText>
              <Button w="100%" onClick={() => inputFileRef.current.click()}>
                Add Photo
              </Button>
              {fileSizeMsg ? (
                <Alert status="error" color="red" text="center">
             
                  <Text ms="10px">{fileSizeMsg}</Text>
                </Alert>
              ) : null}
            </FormControl> */}
            <FormControl mt="20px" id="name">
              <Input
                type="text"
                placeholder="Nama Obat"
                borderRadius="8px"
                onChange={(e) => formik.setFieldValue("nama", e.target.value)}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nama && formik.errors.nama ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.nama}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Pilih Kelas Terapi</FormLabel>
              <Select
                mt="5px"
                placeholder="Kelas Terapi"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue(
                    "kelasTerapiId",
                    parseInt(e.target.value)
                  );
                }}
                onBlur={formik.handleBlur}
              >
                {renderKelasTerapi()}
              </Select>
              {formik.touched.kelasTerapiId && formik.errors.kelasTerapiId ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.kelasTerapiId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Pilih Kategori</FormLabel>
              <Select
                mt="5px"
                placeholder="Kategori"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("kategoriId", parseInt(e.target.value));
                }}
                onBlur={formik.handleBlur}
              >
                {renderKategori()}
              </Select>
              {formik.touched.kategoriId && formik.errors.kategoriId ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.kategoriId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Pilih Satuan</FormLabel>
              <Select
                mt="5px"
                placeholder="Satuan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("satuanId", parseInt(e.target.value));
                }}
                onBlur={formik.handleBlur}
              >
                {renderSatuan()}
              </Select>
              {formik.touched.satuanId && formik.errors.satuanId ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.satuanId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Pilih Sumber Dana</FormLabel>
              <Select
                mt="5px"
                placeholder="Sumber Dana"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue(
                    "sumberDanaId",
                    parseInt(e.target.value)
                  );
                }}
                onBlur={formik.handleBlur}
              >
                {renderSumberDana()}
              </Select>
              {formik.touched.sumberDanaId && formik.errors.sumberDanaId ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.sumberDanaId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl mt={"20px"}>
              <FormLabel>Pilih Penanggungjawab</FormLabel>
              <Select
                mt="5px"
                placeholder="Penanggungjawab"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("profileId", parseInt(e.target.value));
                }}
                onBlur={formik.handleBlur}
              >
                {renderProfile()}
              </Select>
              {formik.touched.profileId && formik.errors.profileId ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.profileId}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <Button
              variant={"primary"}
              w="100%"
              mt="20px"
              mb="40px"
              onClick={formik.handleSubmit}
            >
              Save
            </Button>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default tambahObatBaru;
