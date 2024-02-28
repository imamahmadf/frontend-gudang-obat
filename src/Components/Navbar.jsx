import React from "react";
import { Box, Container, Image, Flex } from "@chakra-ui/react";
import Sidebar from "../Components/Sidebar";
import LogoAPP from "../assets/logo app.png";

function Navbar() {
  return (
    <Box
      display={{ ss: "none", sm: "none", sl: "inline" }}
      bg="white"
      pos="fixed"
      top="0"
      borderBottom="1px"
      borderColor="gray.200"
      w="100%"
      zIndex={10}
    >
      <Container py={"10px"} maxW={"1280px"}>
        <Flex justifyContent={"space-between"}>
          <Sidebar />{" "}
          <Image
            height="45px"
            overflow="hiden"
            objectFit="cover"
            src={LogoAPP}
          />
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;
