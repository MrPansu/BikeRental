import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBicycle,
  FaUsers,
  FaExchangeAlt,
  FaPlus,
} from "react-icons/fa";
import useUserStore from "../../store/user.store";

import {
  Tabs,
  TabList,
  Tab,
  Box,
  useColorModeValue,
  Container,
  Icon,
} from "@chakra-ui/react";

export default function TabNavigation() {
  const location = useLocation();
  const { user } = useUserStore();
  const activeColor = useColorModeValue("blue.500", "blue.300");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const tabs = [
    { path: "/", label: "Dashboard", icon: FaHome },
    { path: "/bikes", label: "Bikes", icon: FaBicycle },
    { path: "/customers", label: "Customers", icon: FaUsers },
    { path: "/transactions", label: "Transactions", icon: FaExchangeAlt },
    { path: "/create", label: "Create New", icon: FaPlus },
  ];

  const currentIndex = tabs.findIndex((tab) => tab.path === location.pathname);

  return (
    <Box
      position="sticky"
      top="16"
      zIndex="1"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="container.xl">
        <Tabs
          index={currentIndex !== -1 ? currentIndex : 0}
          variant="unstyled"
          isLazy
        >
          <TabList overflowX="auto" py={2}>
            {tabs.map((tab) => (
              <Tab
                key={tab.path}
                as={Link}
                to={tab.path}
                flex={{ base: "1", md: "auto" }}
                minW={{ base: "auto", md: "120px" }}
                px={4}
                py={3}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="medium"
                color={location.pathname === tab.path ? activeColor : "inherit"}
                borderBottom="2px"
                borderColor={
                  location.pathname === tab.path ? activeColor : "transparent"
                }
                _hover={{
                  color: activeColor,
                  bg: useColorModeValue("gray.50", "gray.700"),
                }}
                transition="all 0.2s"
                display="flex"
                flexDirection={{ base: "column", md: "row" }}
                alignItems="center"
                gap={2}
              >
                <Icon as={tab.icon} boxSize={{ base: "4", md: "5" }} />
                <Box display={{ base: "none", sm: "block" }}>{tab.label}</Box>
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Container>
    </Box>
  );
}
