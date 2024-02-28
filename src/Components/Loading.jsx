import { Center, Spinner, Image, Flex, Text, Box } from "@chakra-ui/react";
import LogoAPP from "../assets/logo app.png";
function Loading() {
  return (
    <Center h="100vh" flexDirection="column">
      <Image mb="20px" w="100px" h="100px" src={LogoAPP} alt="Turu Icon" />
      <Flex>
        <Text me="10px">please wait</Text> <Spinner color="blue.500" />
      </Flex>
    </Center>
  );
}

export default Loading;
