import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  IconButton,
  Box,
  Flex,
  Image,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Spacer,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { authFirebase } from "../Config/firebase";
import Logo from "../assets/logo.png";

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
import {
  onAuthStateChanged,
  signOut,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import auth_types from "../Redux/Reducers/Types/userTypes";

function Sidebar() {
  const {
    id,
    ProfilePic,
    ProfileName,
    firebaseProviderId,
    UserRoles,
    profileId,
  } = useSelector((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const btnRef = React.useRef();
  const history = useHistory();
  const auth = authFirebase;
  const auth2 = getAuth();

  const location = useLocation();
  const lastSegment = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );
  console.log(location.pathname);

  const menuSidebar = [
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

  //console.log(UserRoles);
  console.log(useSelector((state) => state.user));

  const logout = async () => {
    await signOut(auth).catch((error) => alert(error));
    dispatch({
      type: auth_types.Redux,
      payload: {
        id: "",
        email: "",
        emailVerified: "",
        firebaseProviderId: "",
      },
    });
    history.push("/login");
  };

  return (
    <>
      <Box>
        <IconButton
          ref={btnRef}
          variant={"primary"}
          onClick={onOpen}
          icon={<CgFormatJustify />}
        />
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Flex borderBottom={"2px"} pb={"20px"} borderColor={"gray"}>
              {" "}
              <Image
                height="60px"
                overflow="hiden"
                objectFit="cover"
                src={Logo}
              />
              <Box>
                <Text fontSize={"13px"} textAlign={"center"}>
                  PEMERINTAH KABUPATEN PASER DINAS KESEHATAN
                </Text>
                <Text fontSize={"12px"} textAlign={"center"}>
                  UPTD Perbekalan Obat dan Alkes
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Flex w="100%" mx="auto" justifyContent="space-between">
              <Spacer />
              <Flex fontWeight="bold" fontSize="18px" my="auto" mr="20px">
                <Menu>
                  {id ? (
                    <Box>
                      <MenuButton
                        fontWeight="bold"
                        fontSize="18px"
                        my="auto"
                        ms={"8px"}
                      >
                        {ProfileName}
                      </MenuButton>
                    </Box>
                  ) : (
                    <Box>
                      <i className="fa-solid fa-caret-down"></i>
                      <MenuButton
                        fontWeight="bold"
                        fontSize="18px"
                        my="auto"
                        ms={"3px"}
                      >
                        {ProfileName}
                      </MenuButton>
                    </Box>
                  )}
                  <MenuList>
                    <MenuItem onClick={() => history.push("/gfk/profile")}>
                      Profile
                    </MenuItem>
                    <MenuDivider />
                    <MenuDivider />{" "}
                    <MenuItem
                      onClick={() =>
                        history.push("/gfk/obat-user/" + profileId)
                      }
                    >
                      Obat Saya
                    </MenuItem>{" "}
                    <MenuDivider /> <MenuItem onClick={logout}>Logout</MenuItem>
                    <MenuDivider />
                  </MenuList>
                </Menu>
              </Flex>
              {/* <Avatar
                size="md"
                objectFit={"cover"}
                overflow="hidden"
                my="auto"
                src={import.meta.env.VITE_REACT_APP_API_BASE_URL + ProfilePic}
              /> */}
            </Flex>
            {menuSidebar.map((val, idx) => {
              return (
                <HStack
                  borderRadius={"5px"}
                  w={"100%"}
                  p={"10px"}
                  bgColor={location.pathname == val.URL ? "primary" : "white"}
                  color={location.pathname == val.URL ? "white" : "black"}
                  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                  _hover={{
                    bg: "secondary",
                    color: "black",
                  }}
                  as="button"
                  key={idx}
                  fontSize={"15px"}
                  my={"5px"}
                  onClick={() => {
                    history.push(val.URL);
                  }}
                >
                  {val.logo}
                  <Text marginStart={"10px"}>{val.menu}</Text>
                </HStack>
              );
            })}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;
