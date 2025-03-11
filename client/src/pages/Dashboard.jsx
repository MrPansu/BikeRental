import { useEffect } from "react";
import useBikeStore from "../../store/bike.store";
import useCustomerStore from "../../store/customer.store";
import useTransactionStore from "../../store/transaction.store";
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Dashboard() {
  const { bikes, getAllBikes } = useBikeStore();
  const { customers, getAllCustomers } = useCustomerStore();
  const { transactions, getAllTransactions } = useTransactionStore();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    getAllBikes();
    getAllCustomers();
    getAllTransactions();
  }, []);

  const activeTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (t.payment || 0),
    0
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          shadow="base"
          rounded="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel fontSize="md">Total Bikes</StatLabel>
          <StatNumber fontSize="3xl">{bikes.length}</StatNumber>
          <StatHelpText>Available for rent</StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgColor}
          shadow="base"
          rounded="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel fontSize="md">Total Customers</StatLabel>
          <StatNumber fontSize="3xl">{customers.length}</StatNumber>
          <StatHelpText>Registered customers</StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgColor}
          shadow="base"
          rounded="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel fontSize="md">Active Rentals</StatLabel>
          <StatNumber fontSize="3xl">{activeTransactions}</StatNumber>
          <StatHelpText>Currently rented</StatHelpText>
        </Stat>

        <Stat
          px={4}
          py={5}
          bg={bgColor}
          shadow="base"
          rounded="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel fontSize="md">Total Revenue</StatLabel>
          <StatNumber fontSize="3xl">
            Rp {totalRevenue.toLocaleString()}
          </StatNumber>
          <StatHelpText>All time earnings</StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          p={4}
          rounded="lg"
        >
          <Heading size="md" mb={4}>
            Recent Transactions
          </Heading>
          <Stack divider={<StackDivider />} spacing={4}>
            {transactions.slice(0, 5).map((transaction) => (
              <Box key={transaction._id}>
                <Text fontWeight="bold">
                  Customer: {transaction.customer?.name || "N/A"}
                </Text>
                <Text fontSize="sm">Status: {transaction.status}</Text>
                <Text fontSize="sm">
                  Amount: Rp {transaction.payment?.toLocaleString() || 0}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          p={4}
          rounded="lg"
        >
          <Heading size="md" mb={4}>
            Available Bikes
          </Heading>
          <Stack divider={<StackDivider />} spacing={4}>
            {bikes.slice(0, 5).map((bike) => (
              <Box key={bike._id}>
                <Text fontWeight="bold">{bike.brand}</Text>
                <Text fontSize="sm">
                  Price: Rp {bike.price?.toLocaleString() || 0}/day
                </Text>
                <Text fontSize="sm">Available: {bike.amount} units</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  );
}
