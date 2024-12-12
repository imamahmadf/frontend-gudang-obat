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
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import Layout from "../Components/Layout";
import { Link, useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
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
        console.log(res.data.result);
        console.log(selectedRole);
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
        console.log(res.data.result);
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
        console.log(res.data);
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
      console.log(res.data.result);
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
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nama</Th>
                  <Th>Jabatan</Th>
                  <Th>User Roles</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataUser.map((user) => (
                  <Tr key={user.user?.id}>
                    <Td>{user.nama || "Tidak ada nama"}</Td>
                    <Td>{user.jabatan || "Tidak ada jabatan"}</Td>
                    <Td>
                      {user.user.userRoles.map((val) => (
                        <div key={val.id}>{val.role.name}</div>
                      ))}
                    </Td>
                    <Td>
                      <Button
                        onClick={() => {
                          setCurrentUserId(user.user?.id);
                          onAddOpen();
                        }}
                      >
                        Buka Modal
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentUserId(user.user?.id);
                          setAvailableRoles(user.user.userRoles); // Simpan role yang sesuai

                          onDeleteOpen();
                        }}
                      >
                        Buka Modal delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
