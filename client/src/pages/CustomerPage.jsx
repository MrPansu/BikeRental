import { useState, useEffect } from "react";
import useCustomerStore from "../../store/customer.store";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  SimpleGrid,
  Box,
  Image,
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
} from "@chakra-ui/react";

export default function CustomerPage() {
  const {
    customers,
    loading,
    error,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    getAllCustomers();
  }, []);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      selfie: customer.selfie,
    });
    onOpen();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleDelete = (id) => {
    setCustomerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(customerToDelete);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(selectedCustomer._id, editForm);
      toast({
        title: "Success",
        description: "Customer updated successfully",
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, selfie: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      <Heading mb={6}>Customer List</Heading>

      {customers.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Text fontSize="xl" mb={4}>
            No customers registered yet
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="blue"
            leftIcon={<FaPlus />}
          >
            Register New Customer
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {customers.map((customer) => (
            <Box
              key={customer._id}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
            >
              <Image
                src={customer.selfie}
                alt={customer.name}
                height="200px"
                width="100%"
                objectFit="cover"
              />
              <VStack p={4} align="stretch" spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {customer.name}
                </Text>
                <Text>📞 {customer.phone}</Text>
                <Text noOfLines={2}>📍 {customer.address}</Text>
                <HStack justify="space-between" mt={2}>
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => handleEdit(customer)}
                    aria-label="Edit customer"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDelete(customer._id)}
                    aria-label="Delete customer"
                  />
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
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
            <Text>Are you sure you want to delete this customer?</Text>
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
          <ModalHeader>Edit Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleUpdate}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={editForm.address || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Photo</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editForm.selfie && (
                    <Image
                      src={editForm.selfie}
                      alt="Preview"
                      maxH="200px"
                      mt={2}
                    />
                  )}
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full">
                  Update Customer
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
