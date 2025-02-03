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
  Center,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ListItem,
  List,
  UnorderedList,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { BsXCircle } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";

function PengaturanUser() {
  const [dataUser, setDataUser] = useState([]);
  const [role, setRole] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]); // Tambahkan state baru untuk menyimpan role pengguna yang dipilih
  const [availableRoles, setAvailableRoles] = useState([]); // Tambahkan state baru untuk menyimpan role yang tersedia
  const [nonAvailableRoles, setNonAvailableRoles] = useState([]);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const deleteRole = async () => {
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/user/delete/user-role?userId=${currentUserId}&id=${selectedRole}`
      )
      .then((res) => {
        // console.log(res.data.result);
        // console.log(selectedRole);
        fetchDataUser();
        setAvailableRoles([]);
        onDeleteClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addUserRole = async () => {
    await axios
      .post(
        `${
          import.meta.env.VITE_REACT_APP_API_BASE_URL
        }/user/post/user-role?userId=${currentUserId}&roleId=${selectedRole}`
      )
      .then((res) => {
        // console.log(res.data.result);
        fetchDataUser();
        setSelectedRole("");
        setAvailableRoles([]);
        onAddClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  async function fetchRole() {
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get/role`)
      .then((res) => {
        // console.log(res.data);
        setRole(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function fetchDataUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/get-profile`
      );
      // console.log(res.data.result);
      setDataUser(res.data.result);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDataUser();
    fetchRole();
  }, []);
  return (
    <>
      <Layout>
        <Box bgColor={"secondary"} py={"50px"} mt={"50px"}>
          <Container
            maxW={"1280px"}
            bgColor={"white"}
            borderRadius={"5px"}
            p={"30px"}
          >
            <Text fontSize="xl" mb={4}>
              Pengaturan User
            </Text>
            <Box style={{ overflowX: "auto" }}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Nama
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Jabatan
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      User Roles
                    </Th>
                    <Th
                      bgColor={"primary"}
                      color={"white"}
                      py={"20px"}
                      borderWidth="1px"
                      borderColor="white"
                    >
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dataUser.map((user) => (
                    <Tr key={user.user?.id}>
                      <Td borderWidth="1px" borderColor="primary">
                        {user.nama || "Tidak ada nama"}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {user.jabatan || "Tidak ada jabatan"}
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        <UnorderedList>
                          {user.user.userRoles.map((val) => (
                            <ListItem key={val.id}>{val.role.name}</ListItem>
                          ))}
                        </UnorderedList>
                      </Td>
                      <Td borderWidth="1px" borderColor="primary">
                        {/* ////////// */}
                        <Flex gap={3}>
                          <Center
                            onClick={() => {
                              setCurrentUserId(user.user?.id);
                              onAddOpen();
                            }}
                            borderRadius={"5px"}
                            as="button"
                            h="35px"
                            w="35px"
                            fontSize="14px"
                            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                            color="white"
                            _hover={{
                              bg: "black",
                            }}
                            bg="primary"
                            // onClick={onOpen}
                          >
                            <BsPlusCircle />
                          </Center>{" "}
                          <Center
                            onClick={() => {
                              setCurrentUserId(user.user?.id);
                              setAvailableRoles(user.user.userRoles); // Simpan role yang sesuai

                              onDeleteOpen();
                            }}
                            borderRadius={"5px"}
                            as="button"
                            h="35px"
                            w="35px"
                            fontSize="14px"
                            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                            color="white"
                            _hover={{
                              bg: "black",
                            }}
                            bg="danger"
                            // onClick={onOpen}
                          >
                            <BsXCircle />
                          </Center>
                        </Flex>
                        {/* ////////// */}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Container>
        </Box>

        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Pilih Role</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {" "}
              <Select
                placeholder="Pilih role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {role.map((roleItem) => (
                  <option key={roleItem.id} value={roleItem.id}>
                    {roleItem.name}
                  </option>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={addUserRole}>
                Simpan
              </Button>
              <Button variant="ghost" onClick={onAddClose}>
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Pilih Role</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select
                placeholder="Pilih role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {availableRoles.map(
                  (
                    roleItem // Gunakan availableRoles
                  ) => (
                    <option key={roleItem.id} value={roleItem.id}>
                      {roleItem.role.name}
                    </option>
                  )
                )}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteRole}>
                Simpan
              </Button>
              <Button variant="ghost" onClick={onDeleteClose}>
                Batal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}

export default PengaturanUser;
