import { useState, useRef, useEffect } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Box,
  Text,
  Button,
  InputLeftAddon,
  InputGroup,
  Select,
  Input,
  Alert,
  Image,
  FormHelperText,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import addFoto from "./../assets/add_photo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import axios from "axios";
import Layout from "../Components/Layout";
import { BsFillFunnelFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";

function tambahObat() {
  const toast = useToast();
  const inputFileRef = useRef(null);
  const [namaObat, setNamaObat] = useState([]);
  const [selectedObat, setSelectedObat] = useState(null);
  const [perusahaanId, setPerusahaanId] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeMsg, setFileSizeMsg] = useState("");
  const [sumberDanaId, setSumberDanaId] = useState([]);
  const history = useHistory();

  const { profileId, UserRoles } = useSelector((state) => state.user);

  const handleFile = (event) => {
    if (event.target.files[0].size / 1024 > 1024) {
      setFileSizeMsg("File size is greater than maximum limit");
    } else {
      setSelectedFile(event.target.files[0]);
      let preview = document.getElementById("imgpreview");
      preview.src = URL.createObjectURL(event.target.files[0]);
      formik.setFieldValue("pic", event.target.files[0]);
    }
  };
  function renderPerusahaan() {
    return perusahaanId.map((val) => {
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

  async function fetchNamaPerusahaan() {
    await axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/perusahaan`)
      .then((res) => {
        console.log(res.data, "perusahaan");
        setPerusahaanId(res.data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  async function fetchNamaObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get-nama?profileId=${
          UserRoles.includes(4) ||
          UserRoles.includes(7) ||
          UserRoles.includes(8)
            ? 0
            : profileId
        }`
      )
      .then((res) => {
        console.log(res.data, "tessss");
        setNamaObat(res.data);
        setSumberDanaId(res.data.seedSumberDana);
      })
      .catch((err) => {
        console.error(err.Message);
      });
  }

  YupPassword(Yup);
  //formik initialization
  const formik = useFormik({
    initialValues: {
      noBatch: "",
      exp: "",
      // harga: "",
      stok: "",
      perushaaan: 0,
      sumberDana: 0,
      kotak: "",
    },
    // onSubmit: (values) => {
    //   alert(JSON.stringify(values, null, 2));
    // },
    validationSchema: Yup.object().shape({
      noBatch: Yup.string().required("Mo. Batch wajib diisi"),
      exp: Yup.string().required("tanganggal kadaluarsa wajib diisi"),
      // harga: Yup.number("masukkan angka").required("harga satuan wajib disi"),
      kotak: Yup.number("masukkan angka").required(
        "masukkan jumlah obat perkotak"
      ),
      perusahaan: Yup.number("masukkan angka").required(
        "Perusahaan wajib diisi"
      ),
      sumberDana: Yup.number("masukkan angka").required(
        "Sumber Dana wajib diisi"
      ),
      stok: Yup.number("masukkan angka").required("stok obat wajib disi"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values, "tes formik");
      const { noBatch, exp, harga, stok, perusahaan, kotak, sumberDana } =
        values;

      // kirim data ke back-end
      const formData = new FormData();
      formData.append("noBatch2", noBatch);
      formData.append("exp", exp);
      formData.append("pic", selectedFile);
      formData.append("harga", harga);
      formData.append("stok", stok);
      formData.append("perusahaan", perusahaan);
      formData.append("obatId", selectedObat?.value);
      formData.append("kotak", kotak);
      formData.append("sumberDana", sumberDana);
      await axios
        .post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/no-batch/post`,
          formData
        )
        .then((res) => {
          // Menampilkan toast setelah berhasil
          toast({
            title: "Berhasil!",
            description: "Data Nomor Batch berhasil disimpan.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          // Reset form dan state setelah berhasil
          setSelectedObat(null);

          fetchNamaObat();

          // Arahkan pengguna ke halaman lain (misalnya daftar obat)
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  useEffect(() => {
    fetchNamaObat();
    fetchNamaPerusahaan();
  }, []);

  return (
    <>
      <Layout>
        <Box pt={"80px"} bgColor={"rgba(249, 250, 251, 1)"}>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            p={"30px"}
          >
            {" "}
            <FormControl>
              <FormLabel>Pilih Nama Obat</FormLabel>
              <Select2
                options={namaObat.result?.map((val) => {
                  return {
                    value: val.id,
                    label: `${val.nama} - ${val.kategori.nama}`,
                  };
                })}
                onChange={(choice) => {
                  setSelectedObat(choice);
                }}
                value={selectedObat}
                placeholder="Cari Nama Obat"
                closeMenuOnSelect={false}
              />
            </FormControl>
            <Button
              leftIcon={<BsFillFunnelFill />}
              color="rgba(175, 175, 175, 1)"
              aria-label="toggle filters"
              variant="solid"
              backgroundColor="white"
              border="1px"
              borderRadius={"8px"}
              onClick={() => {
                history.push("/gfk/tambah-obat-baru");
              }}
            >
              Tambah Obat Baru
            </Button>
          </Container>
          <Container
            bgColor={"white"}
            borderRadius={"5px"}
            border={"1px"}
            borderColor={"rgba(229, 231, 235, 1)"}
            maxW={"1280px"}
            display={selectedObat ? "block" : "none"}
            p={"30px"}
          >
            <FormControl>
              <Input
                onChange={handleFile}
                ref={inputFileRef}
                accept="image/png, image/jpeg"
                display="none"
                type="file"

                // hidden="hidden"
              />
            </FormControl>{" "}
            <FormControl>
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
            </FormControl>{" "}
            <FormControl mt="20px">
              <FormHelperText>Max size: 1MB</FormHelperText>
              <Button w="100%" onClick={() => inputFileRef.current.click()}>
                Add Photo
              </Button>
              {fileSizeMsg ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{fileSizeMsg}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>No. Batch</FormLabel>
              <Input
                mt={"10px"}
                type="text"
                placeholder="No. Batch"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("noBatch", e.target.value);
                }}
              />
              {formik.errors.noBatch ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.noBatch}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>EXP</FormLabel>
              <Input
                mt={"10px"}
                placeholder="EXP"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                type="date"
                onChange={(e) => {
                  formik.setFieldValue("exp", e.target.value);
                }}
              />
              {formik.errors.exp ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.exp}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Harga</FormLabel>
              <InputGroup>
                <InputLeftAddon>Rp.</InputLeftAddon>
                <Input
                  type="number"
                  placeholder="Harga"
                  mt={"10px"}
                  border="1px"
                  borderRadius={"8px"}
                  borderColor={"rgba(229, 231, 235, 1)"}
                  onChange={(e) => {
                    formik.setFieldValue("harga", e.target.value);
                  }}
                />
              </InputGroup>
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
                  formik.setFieldValue("stok", e.target.value);
                }}
              />
              {formik.errors.stok ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.stok}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl pb="20px">
              <FormLabel>Kotak</FormLabel>
              <Input
                mt={"10px"}
                type="number"
                placeholder="kotak"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("kotak", e.target.value);
                }}
              />
              {formik.errors.kotak ? (
                <Alert status="error" color="red" text="center">
                  {/* <i className="fa-solid fa-circle-exclamation"></i> */}
                  <Text ms="10px">{formik.errors.kotak}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <FormControl>
              <FormLabel>Perusahaan</FormLabel>
              <Select
                mt="10px"
                placeholder="Perushaan"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={(e) => {
                  formik.setFieldValue("perusahaan", parseInt(e.target.value));
                }}
              >
                {renderPerusahaan()}
              </Select>
              {formik.errors.perusahaanId ? (
                <Alert status="error" color="red" text="center">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <Text ms="10px">{formik.errors.perusahaanId}</Text>
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
                  formik.setFieldValue("sumberDana", parseInt(e.target.value));
                }}
                onBlur={formik.handleBlur}
              >
                {renderSumberDana()}
              </Select>
              {formik.touched.sumberDana && formik.errors.sumberDana ? (
                <Alert status="error" color="red" text="center">
                  <Text ms="10px">{formik.errors.sumberDana}</Text>
                </Alert>
              ) : null}
            </FormControl>
            <Button w="100%" mb="40px" onClick={formik.handleSubmit}>
              Save
            </Button>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default tambahObat;
