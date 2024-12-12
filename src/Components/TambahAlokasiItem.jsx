import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
const TambahAlokasiItem = (props) => {
  const [dataAlokasi, setDataAlokasi] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [totalInput, setTotalInput] = useState(0);
  const selectedBatch = props.data[0];

  async function fetchAlokasi() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/get`)
      .then((res) => {
        setDataAlokasi(res.data[0]);
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function formatDate(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month}, ${year}`;
  }

  function renderNoBatch() {
    return props.data.map((val) => {
      // console.log(val);
      return (
        <option key={val.noBatch} value={val.id}>
          {val.noBatch}
        </option>
      );
    });
  }
  const handleBatchChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = props.data.find((val) => val.id === selectedId);
    setSelectedBatch(selected);
    formik.setFieldValue("noBatchId", selectedId);
  };
  const handleInputChange = (id, value) => {
    const numericValue = parseInt(value) || 0;
    const previousValue = inputValues[id]?.inputValue || 0;
    const newTotalInput = totalInput - previousValue + numericValue;

    setInputValues((prev) => ({
      ...prev,
      [id]: {
        inputValue: numericValue,
        sisaStok: selectedBatch.stok - newTotalInput,
      },
    }));

    setTotalInput(newTotalInput);
  };

  const handleSubmit = () => {
    console.log(inputValues);
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/alokasi/submit`,
        inputValues
      )
      .then((res) => {
        console.log("Data submitted:", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchAlokasi();
  }, []);
  const {
    isOpen: isAlokasiOpen,
    onOpen: onAlokasiOpen,
    onClose: onAlokasiClose,
  } = useDisclosure();
  return (
    <Box>
      <Center
        onClick={onAlokasiOpen}
        borderRadius={"5px"}
        as="button"
        h="25px"
        w="25px"
        fontSize="12px"
        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
        color="white"
        _hover={{
          bg: "black",
        }}
        bg="green"
      >
        alokasi item
      </Center>{" "}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isAlokasiOpen}
        onClose={onAlokasiClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius={0} maxWidth="900px">
          <ModalHeader>Alokasi {dataAlokasi.nama}</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            {" "}
            {selectedBatch && (
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>EXP</Th>
                    <Th>Stok</Th>
                    <Th>Kotak</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{formatDate(selectedBatch.exp)}</Td>
                    <Td>{selectedBatch.stok}</Td>
                    <Td>{selectedBatch.kotak}</Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
            <FormControl>
              <FormLabel>Pilih Nomor Batch</FormLabel>
              <Select
                mt="10px"
                placeholder="Nomor batch"
                border="1px"
                borderRadius={"8px"}
                borderColor={"rgba(229, 231, 235, 1)"}
                onChange={handleBatchChange}
                value={selectedBatch ? selectedBatch.id : ""}
              >
                {renderNoBatch()}
              </Select>
            </FormControl>
            {dataAlokasi.amprahans &&
              dataAlokasi.amprahans.map((item) => (
                <Flex key={item.id} alignItems="center" mb={2}>
                  <Text mr={2}>{item.id}</Text>
                  <Text mr={2}>{item.uptdId}</Text>
                  <Input
                    type="number"
                    placeholder="Input number"
                    value={inputValues[item.id]?.inputValue || ""}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    width="100px"
                    mr={2}
                  />
                  <Text>
                    {inputValues[item.id]?.sisaStok !== undefined
                      ? `Sisa Stok: ${inputValues[item.id].sisaStok}`
                      : ""}
                  </Text>
                </Flex>
              ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TambahAlokasiItem;
