import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { BsCart3 } from "react-icons/bs"; // icon amprahan
import { BsXOctagon } from "react-icons/bs"; //Obat Rusak
import { BsFillBoxSeamFill } from "react-icons/bs"; //Alokasi
import { Link, useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { BsCartXFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import addFoto from "./../assets/add_photo.png";
function AmprahanAktif(props) {
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const history = useHistory();

  function formatTanggal(dateString) {
    var objekTanggal = new Date(dateString);

    // Mengambil nilai hari, bulan, dan tahun
    var hari = objekTanggal.getUTCDate();
    var bulan = objekTanggal.toLocaleString("default", { month: "short" });
    var tahun = objekTanggal.getUTCFullYear();

    // Menggabungkan hasilnya
    return `${hari} ${bulan} ${tahun}`;
  }

  const { UserRoles, profileId } = useSelector((state) => state.user);
  function hapusPermintaan(val) {
    console.log(val, "DELETE PERMINTAAN");
    // Tambahkan logika untuk menghapus permintaan di sini
    axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/delete/amparahan-item`,
        {
          id: val.id,
          permintaan: val.permintaan,
          sisa: val.sisa,
          obatId: val.noBatch.obat.id,
          totalStok: val.noBatch.obat.totalStok,
          stok: val.noBatch.stok,
          noBatchId: val.noBatch.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        setEditIndex(null);
        setDeleteIndex(null);
        props.randomNumber(Math.random());
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function ubahPermintaan(val) {
    console.log(val, "PERMINTAAN", inputValue);
    axios
      .patch(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/amprahan/patch/ubah-permintaan`,
        {
          id: val.id,
          permintaan: val.permintaan,
          permintaanBaru: parseInt(inputValue),
          sisa: val.sisa,
          obatId: val.noBatch.obat.id,
          totalStok: val.noBatch.obat.totalStok,
          stok: val.noBatch.stok,
          noBatchId: val.noBatch.id,
        }
      )
      .then((res) => {
        console.log(res.data);
        setEditIndex(null);
        setDeleteIndex(null);
        props.randomNumber(Math.random());
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <>
      {UserRoles.includes(7) ||
      UserRoles.includes(8) ||
      (UserRoles.includes(6) && props.data.StatusAmprahanId === 7) ? (
        <Flex gap={"20px"}>
          <Flex
            onClick={() => {
              {
                props?.data?.StatusAmprahanId <= 3
                  ? history.push(`/gfk/amprahan/${props.data.id}`)
                  : props?.data?.StatusAmprahanId
                  ? history.push(`/gfk/obat-rusak`)
                  : null;
              }
            }}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"10px"}
            w={{ ss: "100%", sl: "33%" }}
          >
            {" "}
            <Center
              bgColor={
                props?.data?.StatusAmprahanId <= 3
                  ? "primary"
                  : props?.data?.StatusAmprahanId === 7
                  ? "danger"
                  : props?.data?.StatusAmprahanId === 4
                  ? "biru"
                  : null
              }
              p={{ ss: "10px", sl: "15px" }}
              color={"white"}
              fontSize={"30px"}
              borderRadius={"5px"}
              me={"10px"}
              h={{ ss: "40px", sl: "60px" }}
              w={{ ss: "40px", sl: "60px" }}
            >
              {props?.data?.StatusAmprahanId <= 3 ? (
                <BsCart3 />
              ) : props?.data?.StatusAmprahanId === 7 ? (
                <BsXOctagon />
              ) : props?.data?.StatusAmprahanId === 4 ? (
                <BsFillBoxSeamFill />
              ) : null}
            </Center>
            <Box>
              {" "}
              <Heading>{props?.data?.StatusAmprahan?.nama}</Heading>
              {props?.data?.StatusAmprahanId === 4 ? (
                <Text> Nama Alokasi: {props?.data?.alokasi?.nama}</Text>
              ) : (
                <Text> tujuan: {props?.data?.uptd?.nama}</Text>
              )}
              <Text>Tanggal: {formatTanggal(props?.data?.tanggal)}</Text>
            </Box>
          </Flex>

          {props?.data?.amprahanItems?.map((item, index) => (
            <Flex
              key={index}
              bgColor={"white"}
              borderRadius={"5px"}
              border={"1px"}
              borderColor={"rgba(229, 231, 235, 1)"}
              p={"10px"}
              w={{ ss: "100%", sl: "33%" }}
            >
              <Image
                borderRadius={"5px"}
                alt="foto obat"
                width="70px"
                me="10px"
                overflow="hiden"
                objectFit="cover"
                src={
                  item?.noBatch?.pic
                    ? import.meta.env.VITE_REACT_APP_API_BASE_URL +
                      item?.noBatch?.pic
                    : addFoto
                }
              />
              <Box w={"100%"}>
                <Heading as="h4" size="md">
                  {item?.noBatch?.obat?.nama || "Nama Obat Tidak Tersedia"}
                </Heading>
                <Text>
                  {item?.noBatch?.noBatch || "No Batch Tidak Tersedia"}
                </Text>
                <Divider
                  orientation="horizontal"
                  border="1px solid"
                  borderColor={"primary"}
                />
                <>
                  <Text>Permintaan:</Text>
                  <Text>
                    {item?.permintaan} (
                    {`${Math.floor(
                      item?.permintaan / item?.noBatch?.kotak
                    )} kotak` +
                      (item?.permintaan % item?.noBatch?.kotak !== 0
                        ? ` dan ${item?.permintaan % item?.noBatch?.kotak} ecer`
                        : "")}{" "}
                    )
                  </Text>
                </>
              </Box>{" "}
              <Flex flexDirection={"column"}>
                <Tooltip label="Ubah" aria-label="A tooltip">
                  <Center
                    onClick={() => {
                      setEditIndex(index);
                    }}
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
                    // onClick={onOpen}
                  >
                    <BsPencilFill />
                  </Center>
                </Tooltip>{" "}
                <Spacer />
                <Tooltip label="Hapus" aria-label="A tooltip">
                  <Center
                    onClick={() => {
                      setDeleteIndex(index);
                    }}
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
                    // onClick={onOpen}
                  >
                    <BsCartXFill />
                  </Center>
                </Tooltip>{" "}
              </Flex>
              <Modal
                closeOnOverlayClick={false}
                isOpen={editIndex === index || deleteIndex === index}
                onClose={() => {
                  setEditIndex(null);
                  setDeleteIndex(null);
                }}
              >
                <ModalOverlay />
                <ModalContent borderRadius={0}>
                  <ModalHeader>
                    {editIndex === index
                      ? "Ubah Permintaan"
                      : "Hapus Permintaan"}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    {editIndex === index ? (
                      <FormControl pb="20px">
                        <Input
                          mt={"10px"}
                          type="number"
                          placeholder="stok"
                          border="1px"
                          borderRadius={"8px"}
                          borderColor={"rgba(229, 231, 235, 1)"}
                          defaultValue={item.permintaan}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                      </FormControl>
                    ) : (
                      <Text>
                        Apakah Anda yakin ingin menghapus permintaan ini?
                      </Text>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    {editIndex === index ? (
                      <Button
                        onClick={(e) => {
                          ubahPermintaan(item);
                        }}
                        bg={"primary"}
                        color={"white"}
                        _hover={{
                          bg: "black",
                        }}
                      >
                        Ubah
                      </Button>
                    ) : (
                      <Button
                        bg={"danger"}
                        color={"white"}
                        _hover={{
                          bg: "black",
                        }}
                        onClick={(e) => {
                          hapusPermintaan(item);
                        }}
                      >
                        Hapus
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          ))}
        </Flex>
      ) : null}
    </>
  );
}

export default AmprahanAktif;
