import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import useUserStore from "../../store/user.store";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await login(values);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } catch (error) {
        let errorMessage = "Please check your credentials";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        toast({
          title: "Login failed",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
      h="100vh"
      display="flex"
      alignItems="center"
    >
      <Stack spacing="8" w="full">
        <Stack spacing="6" align="center">
          <Image
            src="/your-logo.png"
            alt="Logo"
            boxSize="64px"
            fallback={
              <Box
                bg="blue.500"
                w="64px"
                h="64px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl" color="white" fontWeight="bold">
                  BR
                </Text>
              </Box>
            }
          />
          <Stack spacing="3" textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>
              Log in to your account
            </Heading>
            <Text color="gray.500">
              Welcome back! Please enter your details.
            </Text>
          </Stack>
        </Stack>

        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={{ base: "transparent", sm: bgColor }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
          borderWidth={{ base: "0", sm: "1px" }}
          borderColor={borderColor}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl
                  isInvalid={formik.touched.email && formik.errors.email}
                  isRequired
                >
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    placeholder="Enter your email"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <Text color="red.500">{formik.errors.email}</Text>
                  ) : null}
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.password && formik.errors.password}
                  isRequired
                >
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...formik.getFieldProps("password")}
                      placeholder="Enter your password"
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.password && formik.errors.password ? (
                    <Text color="red.500">{formik.errors.password}</Text>
                  ) : null}
                </FormControl>
              </Stack>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                Sign in
              </Button>

              <Stack spacing="6">
                <Text textAlign="center">
                  Don't have an account?{" "}
                  <Button
                    as={RouterLink}
                    to="/register"
                    variant="link"
                    colorScheme="blue"
                  >
                    Register
                  </Button>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
