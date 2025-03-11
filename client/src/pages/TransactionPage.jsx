import { useState, useEffect } from "react";
import useTransactionStore from "../../store/transaction.store";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
} from "@chakra-ui/react";

export default function TransactionPage() {
  const {
    transactions,
    loading,
    error,
    getAllTransactions,
    updateTransaction,
    deleteTransaction,
  } = useTransactionStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editForm, setEditForm] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    getAllTransactions();
  }, []);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditForm({
      start_time: new Date(transaction.start_time).toISOString().slice(0, 16),
      end_time: new Date(transaction.end_time).toISOString().slice(0, 16),
      return_time: transaction.return_time
        ? new Date(transaction.return_time).toISOString().slice(0, 16)
        : new Date(transaction.end_time).toISOString().slice(0, 16),
      status: transaction.status,
    });
    onOpen();
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleDelete = (id) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(transactionToDelete);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
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
      await updateTransaction(selectedTransaction._id, editForm);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
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
      <Heading mb={6}>Transactions</Heading>

      {transactions.length === 0 ? (
        <Box
          textAlign="center"
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Text fontSize="xl" mb={4}>
            No transactions recorded yet
          </Text>
          <Button
            as={RouterLink}
            to="/create"
            colorScheme="blue"
            leftIcon={<FaPlus />}
          >
            Create New Transaction
          </Button>
        </Box>
      ) : (
        <Box
          overflowX="auto"
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Customer</Th>
                <Th>Bike</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
                <Th>Return Time</Th>
                <Th>Fine</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction._id}>
                  <Td>
                    {transaction.customer?.name || (
                      <Badge colorScheme="red">Customer not found</Badge>
                    )}
                  </Td>
                  <Td>
                    {transaction.bike?.brand || (
                      <Badge colorScheme="red">Bike not found</Badge>
                    )}
                  </Td>
                  <Td>
                    {new Date(transaction.start_time).toLocaleDateString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                      }
                    )}
                  </Td>
                  <Td>
                    {new Date(transaction.end_time).toLocaleDateString(
                      "id-ID",
                      {
                        dateStyle: "medium",
                      }
                    )}
                  </Td>
                  <Td>
                    {transaction.return_time
                      ? new Date(transaction.return_time).toLocaleDateString(
                          "id-ID",
                          { dateStyle: "medium" }
                        )
                      : "-"}
                  </Td>
                  <Td>Rp {transaction.total_fine?.toLocaleString()}</Td>
                  <Td>Rp {transaction.payment?.toLocaleString()}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        transaction.status === "completed" ? "green" : "yellow"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        aria-label="Edit transaction"
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(transaction._id)}
                        aria-label="Delete transaction"
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
            <Text>Are you sure you want to delete this transaction?</Text>
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
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleUpdate}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={editForm.start_time || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        start_time: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={editForm.end_time || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        end_time: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Return Time</FormLabel>
                  <Input
                    type="datetime-local"
                    value={editForm.return_time || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        return_time: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={editForm.status || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full">
                  Update Transaction
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
