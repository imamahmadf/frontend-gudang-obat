import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Container,
  Flex,
  Spacer,
  Checkbox,
  Stack,
  Button,
  SimpleGrid,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import AmprahanAktif from "../Components/AmprahanAktif";
function Alokasi() {
  const [tujuan, setTujuan] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [namaAlokasi, setNamaAlokasi] = useState("");
  const history = useHistory();
  const [status, setStatus] = useState([]);
  async function fetchDataTujuan() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/uptd/puskesmas`)
      .then((res) => {
        console.log(res.data, "ALOKASI TUJUAN PKM");
        setTujuan(res.data.result);
        setCheckedItems(new Array(res.data.result.length).fill(false));
      })
      .catch((err) => {
        console.error(err);
      });
  }
  async function fetchStatus() {
    await axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/amprahan/get/is-open`
      )
      .then((res) => {
        setStatus(res.data[0]);
        console.log(res.data[0], "STATUSSSS");
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);

    if (updatedCheckedItems[index]) {
      setCheckedIds([...checkedIds, tujuan[index].id]);
    } else {
      setCheckedIds(checkedIds.filter((id) => id !== tujuan[index].id));
    }

    setAllChecked(updatedCheckedItems.every(Boolean));
  };

  const handleAllCheckboxChange = (e) => {
    const checked = e.target.checked;
    setCheckedItems(new Array(tujuan.length).fill(checked));
    setAllChecked(checked);

    if (checked) {
      setCheckedIds(tujuan.map((item) => item.id));
    } else {
      setCheckedIds([]);
    }
  };

  const handleSubmit = () => {
    axios
      .post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/post`, {
        tujuanId: checkedIds,
        judul: namaAlokasi,
      })
      .then((response) => {
        console.log("Data berhasil dikirim:", response.data);
        setCheckedItems(new Array(tujuan.length).fill(false));
        setCheckedIds([]);
        setAllChecked(false);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengirim data:", error);
      });
  };

  function inputHandler(event) {
    console.log(event.target.value);
    setNamaAlokasi(event.target.value);
  }

  useEffect(() => {
    fetchDataTujuan();
    fetchStatus();
  }, []);

  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"} minHeight={"80vh"}>
          {status ? (
            <>
              <Container
                bgColor={
                  status?.StatusAmprahanId <= 3
                    ? "primary"
                    : status?.StatusAmprahanId === 7
                    ? "danger"
                    : status?.StatusAmprahanId === 4
                    ? "biru"
                    : "white"
                }
                borderRadius={"5px"}
                border={"1px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                maxW={"1280px"}
                marginBottom={"20px"}
                padding={"20px"}
              >
                <AmprahanAktif data={status} />
              </Container>
            </>
          ) : (
            <Container
              maxW={"1280px"}
              bgColor={"white"}
              borderRadius={"5px"}
              p={"30px"}
            >
              <Button
                onClick={() => {
                  history.push("/gfk/daftar-alokasi");
                }}
              >
                Daftar Alokasi
              </Button>
              <FormControl>
                <FormLabel>Nama Alokasi</FormLabel>
                <Input
                  onChange={inputHandler}
                  type="name"
                  placeholder="nama Alokasi"
                  borderRadius="8px"
                  borderColor="rgba(175, 175, 175, 1)"
                ></Input>
              </FormControl>
              <Checkbox
                isChecked={allChecked}
                onChange={handleAllCheckboxChange}
              >
                Centang Semua
              </Checkbox>
              <SimpleGrid minChildWidth="300px" columns={2} spacing={5}>
                {tujuan.map((item, index) => (
                  <Box borderRadius={"5px"} p={"10px"} bgColor={"secondary"}>
                    {" "}
                    <Checkbox
                      colorScheme="green"
                      key={item.id}
                      isChecked={checkedItems[index]}
                      onChange={() => handleCheckboxChange(index)}
                    >
                      {item.nama}
                    </Checkbox>{" "}
                  </Box>
                ))}
              </SimpleGrid>
              <Text>Checked IDs: {checkedIds.join(", ")}</Text>
              {namaAlokasi ? (
                <>
                  {" "}
                  <Button onClick={handleSubmit} colorScheme="teal" mt={4}>
                    Submit
                  </Button>
                </>
              ) : null}
            </Container>
          )}
        </Box>
      </Layout>
    </>
  );
}

export default Alokasi;
