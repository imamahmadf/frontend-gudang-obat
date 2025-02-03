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
  FormControl,
  FormLabel,
  Center,
  HStack,
} from "@chakra-ui/react";
import {
  Select as Select2,
  CreatableSelect,
  AsyncSelect,
} from "chakra-react-select";
import { useDispatch, useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
import FotoHome from "../assets/gfk-depan.jpg";
import { Link, useHistory } from "react-router-dom";

import Layout from "../Components/Layout";

function Home() {
  const history = useHistory();
  const [namaObat, setNamaObat] = useState([]);
  const [selectedObat, setSelectedObat] = useState(null);
  const { profileId, UserRoles } = useSelector((state) => state.user);
  async function fetchNamaObat() {
    await axios
      .get(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/obat/get-nama?profileId=${0}`
      )
      .then((res) => {
        // console.log(res.data, "tessss");
        setNamaObat(res.data);
      })
      .catch((err) => {
        console.error(err.Message);
      });
  }
  useEffect(() => {
    fetchNamaObat();
  }, []);
  return (
    <>
      <Layout>
        <Box
          height="100vh"
          backgroundImage={`url(${FotoHome})`}
          backgroundSize="cover"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            backgroundColor="rgba(0, 0, 0, 0.5)"
          />
          <Box>
            <Text
              color="white"
              textAlign="center"
              position="relative"
              fontWeight={800}
              fontSize={{ ss: "30px", sl: "60px" }}
              mb={"20px"}
            >
              SELAMAT DATANG DI APTEKA
            </Text>{" "}
            {profileId ? (
              <Box
                mt={"30px"}
                position="relative"
                p={"10px"}
                bgColor={"white"}
                borderRadius={"5px"}
              >
                <HStack>
                  <FormControl border={0} bgColor={"white"}>
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
                      focusBorderColor="red"
                      closeMenuOnSelect={false}
                    />
                  </FormControl>{" "}
                  <Center
                    borderRadius={"5px"}
                    color={"white"}
                    p={"10px"}
                    bgColor={"primary"}
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    as="button"
                    _hover={{
                      bg: "primaryGelap",
                    }}
                    onClick={() => {
                      history.push(`/gfk/detail-obat/${selectedObat.value}`);
                    }}
                  >
                    <BsSearch />
                  </Center>
                </HStack>
              </Box>
            ) : (
              <Center gap={4}>
                <Button
                  variant={"primary"}
                  onClick={() => {
                    history.push(`/login`);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    history.push(`/register`);
                  }}
                >
                  Register
                </Button>
              </Center>
            )}
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export default Home;
