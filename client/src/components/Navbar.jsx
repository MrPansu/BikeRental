import { Link as RouterLink } from "react-router-dom";
import useUserStore from "../../store/user.store";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  IconButton,
  Container,
} from "@chakra-ui/react";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useUserStore();

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box fontWeight="bold">
            <RouterLink to="/">Bike Rental</RouterLink>
          </Box>

          <Flex alignItems={"center"} gap={4}>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Button as={RouterLink} to="/users" variant="ghost">
                    Users
                  </Button>
                )}
                <Button onClick={logout} colorScheme="red" variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <Stack direction={"row"} spacing={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="blue">
                  Register
                </Button>
              </Stack>
            )}

            <IconButton
              onClick={toggleColorMode}
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              aria-label={`Toggle ${
                colorMode === "light" ? "Dark" : "Light"
              } Mode`}
              variant="ghost"
            />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
