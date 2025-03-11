import { useState, useEffect } from "react";
import useBikeStore from "../../store/bike.store";
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
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";

export default function BikePage() {
  const { bikes, loading, error, getAllBikes, updateBike, deleteBike } =
    useBikeStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBike, setSelectedBike] = useState(null);
  const [editForm, setEditForm] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    getAllBikes();
  }, []);

  const handleEdit = (bike) => {
    setSelectedBike(bike);
    setEditForm({
      brand: bike.brand,
      price: bike.price,
      amount: bike.amount,
      picture: bike.picture,
    });
    onOpen();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);

  const handleDelete = async (id) => {
    setBikeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBike(bikeToDelete);
      toast({
        title: "Success",
        description: "Bike deleted successfully",
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
      await updateBike(selectedBike._id, editForm);
      toast({
        title: "Success",
        description: "Bike updated successfully",
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
        setEditForm((prev) => ({ ...prev, picture: reader.result }));
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
      <Heading mb={6}>Available Bikes</Heading>

      {bikes.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Text fontSize="xl" mb={4}>
            No bikes available
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="blue"
            leftIcon={<FaPlus />}
          >
            Create New Bike
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {bikes.map((bike) => (
            <Box
              key={bike._id}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
            >
              <Image
                src={bike.picture}
                alt={bike.brand}
                height="200px"
                width="100%"
                objectFit="cover"
              />
              <VStack p={4} align="stretch" spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {bike.brand}
                </Text>
                <Text color="green.500" fontSize="lg">
                  Rp {bike.price?.toLocaleString()}/day
                </Text>
                <Text>Available: {bike.amount} units</Text>
                <HStack justify="space-between" mt={2}>
                  <IconButton
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => handleEdit(bike)}
                    aria-label="Edit bike"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDelete(bike._id)}
                    aria-label="Delete bike"
                  />
                </HStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Are you sure you want to delete this bike?</Text>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Bike</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleUpdate}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    value={editForm.brand || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Price per Day</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      value={editForm.price || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      value={editForm.amount || ""}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Picture</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editForm.picture && (
                    <Image
                      src={editForm.picture}
                      alt="Preview"
                      maxH="200px"
                      mt={2}
                    />
                  )}
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full">
                  Update Bike
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
