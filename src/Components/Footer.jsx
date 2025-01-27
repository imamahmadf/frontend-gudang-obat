import React from "react";
import {
  Box,
  Container,
  Text,
  HStack,
  VStack,
  Center,
  Image,
  Divider,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoPutih from "../assets/logo-apteka-putih.png";
import { BsGeoAltFill } from "react-icons/bs";
import { BsEnvelopeAtFill } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { authFirebase } from "../Config/firebase";
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { CgFormatJustify } from "react-icons/cg";
import { BiHome } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { BsCapsule } from "react-icons/bs";
import { BsGear } from "react-icons/bs";
import { BsBarChartLine } from "react-icons/bs";
import { BsTruck } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { BsXOctagon } from "react-icons/bs";
function Footer() {
  const {
    id,
    ProfilePic,
    ProfileName,
    firebaseProviderId,
    UserRoles,
    profileId,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const btnRef = React.useRef();
  const history = useHistory();
  const auth = authFirebase;
  const auth2 = getAuth();
  const menuFooter = [
    { menu: "Daftar Obat", logo: <BsCapsule />, URL: "/gfk/daftar-obat" },
    { menu: "Puskesmas", logo: <BiHome />, URL: "/gfk/puskesmas" },
    { menu: "Amprahan", logo: <BsCart3 />, URL: "/gfk/amprahan" },

    ...(UserRoles?.includes(2) ||
    UserRoles?.includes(7) ||
    UserRoles?.includes(8)
      ? [
          {
            menu: "Alokasi",
            logo: <BsFillBoxSeamFill />,
            URL: "/gfk/alokasi",
          },
        ]
      : []),

    ...(UserRoles?.includes(5) ||
    UserRoles?.includes(7) ||
    UserRoles?.includes(8)
      ? [
          {
            menu: "Obat Masuk",
            logo: <BsTruck />,
            URL: "/gfk/obat-masuk",
          },
        ]
      : []),

    ...(UserRoles?.includes(7) || UserRoles?.includes(8)
      ? [
          {
            menu: "Stock Opname",
            logo: <BsClipboard2Check />,
            URL: "/gfk/stok-opname",
          },
        ]
      : []),

    ...(UserRoles?.includes(2) ||
    UserRoles?.includes(7) ||
    UserRoles?.includes(8)
      ? [
          {
            menu: "Laporan",
            logo: <BsBarChartLine />,
            URL: "/gfk/laporan",
          },
        ]
      : []),
    ...(UserRoles?.includes(1) ||
    UserRoles?.includes(2) ||
    UserRoles?.includes(6) ||
    UserRoles?.includes(7) ||
    UserRoles?.includes(8)
      ? [
          {
            menu: "Kadaluwarsa",
            logo: <BsTrash3 />,
            URL: "/gfk/kadaluwarsa",
          },
        ]
      : []),
    ...(UserRoles?.includes(2) ||
    UserRoles?.includes(6) ||
    UserRoles?.includes(7) ||
    UserRoles?.includes(8)
      ? [
          {
            menu: "Obat Rusak",
            logo: <BsXOctagon />,
            URL: "/gfk/obat-rusak",
          },
        ]
      : []),

    ...(UserRoles?.includes(7) || UserRoles?.includes(8)
      ? [
          {
            menu: "Pengaturan",
            logo: <BsGear />,
            URL: "/gfk/pengaturan",
          },
        ]
      : []),
  ];
  return (
    <>
      <Box bgColor={"primary"}>
        <Container py={"50px"} maxW={"1280px"}>
          <Image w={"350px"} src={LogoPutih} />
          <Box color={"white"} mt={"60px"}>
            <SimpleGrid columns={3} minChildWidth="200px">
              <Flex>
                <BsGeoAltFill fontSize={"30px"} />
                <Box ms={"10px"}>
                  <Text
                    fontSize={"18px"}
                    fontWeight={700}
                    width={"150px"}
                    me={"10px"}
                  >
                    ALamat:
                  </Text>
                  <Text fontSize={"14px"} fontWeight={300} me={"10px"}>
                    Jalan Yos Sudarso, Senaken, Kec. Tanah Grogot, Kabupaten
                    Paser
                  </Text>
                </Box>
              </Flex>{" "}
              <Flex>
                <BsEnvelopeAtFill fontSize={"30px"} />
                <Box ms={"10px"}>
                  <Text
                    fontSize={"18px"}
                    fontWeight={700}
                    width={"150px"}
                    me={"10px"}
                  >
                    Email:
                  </Text>
                  <Text fontSize={"14px"} fontWeight={300} me={"10px"}>
                    apteka.paser@gmail.com
                  </Text>
                </Box>
              </Flex>{" "}
              <Flex>
                <BsInstagram fontSize={"30px"} />
                <Box ms={"10px"}>
                  <Text
                    fontSize={"18px"}
                    fontWeight={700}
                    width={"150px"}
                    me={"10px"}
                  >
                    Instagram:
                  </Text>
                  <Text fontSize={"14px"} fontWeight={300} me={"10px"}>
                    gfkpaser
                  </Text>
                </Box>
              </Flex>
            </SimpleGrid>
          </Box>
          <Box mt={"20px"} ps={"10px"}>
            <Text
              fontSize={"18px"}
              fontWeight={700}
              width={"150px"}
              me={"10px"}
              color={"white"}
            >
              Menu:
            </Text>{" "}
            <Divider mt={"10px"} mb={"10px"} />
          </Box>
          <SimpleGrid color={"white"} mt={"5px"} minChildWidth="350px">
            {menuFooter.map((val, idx) => {
              return (
                <>
                  <HStack
                    borderRadius={"5px"}
                    w={"100%"}
                    p={"10px"}
                    as="button"
                    key={idx}
                    fontSize={"15px"}
                    my={"5px"}
                    onClick={() => {
                      history.push(val.URL);
                    }}
                  >
                    <Text
                      align={"left"}
                      fontSize={"18px"}
                      width={"150px"}
                      me={"10px"}
                    >
                      {val.menu}
                    </Text>
                  </HStack>
                </>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>
      <Box
        borderTop={"1px"}
        borderColor={"white"}
        py={"20px"}
        bgColor={"primary"}
        color={"white"}
      >
        <Container>
          <Center>
            Copyright © 2025 Imam Ahmad Fahrurazi. All Right Reserved
          </Center>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
