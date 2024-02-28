import React from "react";
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
  Button,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { CgFormatJustify } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
import { BiHome } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { BsCapsule } from "react-icons/bs";
import { BsGear } from "react-icons/bs";
import Logo from "../assets/logo.png";
import { Link, useHistory } from "react-router-dom";
import TambahAprahan from "./TambahAprahan";

function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const history = useHistory();
  const menuSidebar = [
    { menu: "Daftar Obat", logo: <BsCapsule />, URL: "/gfk/daftar-obat" },
    { menu: "Puskesmas", logo: <BiHome />, URL: "/gfk/puskesmas" },
    { menu: "Amprahan", logo: <BsCart3 />, URL: "/gfk/amprahan" },
    { menu: "Laporan", logo: <BsClipboard2Check />, URL: "/gfk/laporan" },
    { menu: "Pengaturan", logo: <BsGear />, URL: "/gfk/pengaturan" },
  ];
  return (
    <>
      <Box>
        <IconButton
          ref={btnRef}
          colorScheme="blue"
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
            {menuSidebar.map((val, idx) => {
              return (
                <HStack
                  borderRadius={"5px"}
                  w={"100%"}
                  p={"10px"}
                  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                  _hover={{
                    bg: "black",
                    color: "white",
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
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>{" "}
            <IconButton
              aria-label="Add to friends"
              icon={<CgFormatJustify />}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;
