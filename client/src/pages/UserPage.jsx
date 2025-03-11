import { useState, useEffect } from "react";
import useUserStore from "../../store/user.store";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  SimpleGrid,
  Box,
  Select,
  Text,
  Button,
  useColorModeValue,
  Heading,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Spinner,
  Center,
  Avatar,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

export default function UserPage() {
  const { users, loading, error, getAllUsers, updateUser, deleteUser } =
    useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: "", // Empty for security
      role: user.role, // Add role field
    });
    onOpen();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDelete = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      toast({
        title: "Success",
        description: "User deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters"),
    role: yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: editForm,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const updateData = {
          username: values.username,
          email: values.email,
          role: values.role,
          ...(values.password && { password: values.password }),
        };

        await updateUser(selectedUser._id, updateData);
        toast({
          title: "Success",
          description: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="50vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>User Management</Heading>

      {users.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Text fontSize="xl" mb={4}>
            No users registered yet
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="blue"
            leftIcon={<FaPlus />}
          >
            Add New User
          </Button>
        </Box>
      ) : (
        <Box
          bg={bgColor}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          shadow="sm"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>
                    <HStack>
                      <Avatar
                        name={user.username}
                        size="sm"
                        bg="blue.500"
                        color="white"
                      />
                      <Text fontWeight="medium">{user.username}</Text>
                    </HStack>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={user.role === "admin" ? "green" : "blue"}
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        aria-label="Edit user"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                        aria-label="Delete user"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Are you sure you want to delete this user?</Text>
            <HStack spacing={4} mt={4}>
              <Button colorScheme="red" onClick={confirmDelete}>
                Delete
              </Button>
              <Button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4}>
                <FormControl
                  isInvalid={formik.touched.username && formik.errors.username}
                >
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <Text color="red.500">{formik.errors.username}</Text>
                  ) : null}
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.email && formik.errors.email}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <Text color="red.500">{formik.errors.email}</Text>
                  ) : null}
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.password && formik.errors.password}
                >
                  <FormLabel>New Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Enter new password"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <Text color="red.500">{formik.errors.password}</Text>
                  ) : null}
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.role && formik.errors.role}
                >
                  <FormLabel>Role</FormLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                  {formik.touched.role && formik.errors.role ? (
                    <Text color="red.500">{formik.errors.role}</Text>
                  ) : null}
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full">
                  Update User
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
