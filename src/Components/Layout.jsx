import React from "react";
import { Box, Container } from "@chakra-ui/react";
import NavbarGfk from "../Components/Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <Box>
      <NavbarGfk />
      {children}
      <Footer />
    </Box>
  );
}

export default Layout;
