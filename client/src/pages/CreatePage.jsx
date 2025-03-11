import { useState, useEffect } from "react";
import useBikeStore from "../../store/bike.store";
import useCustomerStore from "../../store/customer.store";
import useTransactionStore from "../../store/transaction.store";

import {
  Box,
  Container,
  Heading,
  Select,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  Image,
} from "@chakra-ui/react";

export default function CreatePage() {
  const [entityType, setEntityType] = useState("");
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const { bikes, getAllBikes, addBike } = useBikeStore();
  const { customers, getAllCustomers, addCustomer } = useCustomerStore();
  const { addTransaction } = useTransactionStore();

  useEffect(() => {
    getAllBikes();
    getAllCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [e.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (entityType) {
        case "bike":
          await addBike(formData);
          break;
        case "customer":
          await addCustomer(formData);
          break;
        case "transaction":
          await addTransaction(formData);
          break;
        default:
          return;
      }

      toast({
        title: "Success",
        description: `${entityType} created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({});
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

  const renderForm = () => {
    switch (entityType) {
      case "bike":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Brand</FormLabel>
              <Input
                name="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Price (per day)</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="price"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange(e)}
                />
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="amount"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange(e)}
                />
              </NumberInput>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Picture</FormLabel>
              <Input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.picture && (
                <Image
                  src={formData.picture}
                  alt="Preview"
                  maxH="200px"
                  mt={2}
                />
              )}
            </FormControl>
          </VStack>
        );

      case "customer":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Selfie</FormLabel>
              <Input
                type="file"
                name="selfie"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.selfie && (
                <Image
                  src={formData.selfie}
                  alt="Preview"
                  maxH="200px"
                  mt={2}
                />
              )}
            </FormControl>
          </VStack>
        );

      case "transaction":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Customer</FormLabel>
              <Select
                name="customer"
                value={formData.customer || ""}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Bike</FormLabel>
              <Select
                name="bike"
                value={formData.bike || ""}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select Bike
                </option>
                {bikes.map((bike) => (
                  <option
                    key={bike._id}
                    value={bike._id}
                    disabled={bike.amount === 0}
                  >
                    {bike.brand} {bike.amount === 0 ? "(Unavailable)" : ""}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                name="start_time"
                type="datetime-local"
                value={formData.start_time || ""}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                name="end_time"
                type="datetime-local"
                value={formData.end_time || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="base">
        <Heading mb={6} size="lg">
          Create New
        </Heading>

        <FormControl mb={6}>
          <FormLabel>Select Type</FormLabel>
          <Select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setFormData({});
            }}
            placeholder="Select what to create"
          >
            <option value="bike">Bike</option>
            <option value="customer">Customer</option>
            <option value="transaction">Transaction</option>
          </Select>
        </FormControl>

        <form onSubmit={handleSubmit}>
          {renderForm()}

          {entityType && (
            <Button mt={6} colorScheme="blue" type="submit" w="full">
              Create {entityType}
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
}
