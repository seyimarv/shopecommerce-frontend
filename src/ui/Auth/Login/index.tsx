"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import Button from "@/ui/common/components/button";
import Link from "next/link";
import { PasswordInput } from "@/ui/common/components/input/password-input";
import { useLogin } from "@/lib/data/customer";
import { useRouter } from "next/navigation";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

const Login = () => {
  const router = useRouter();
  const { mutate: login, isPending, isError, error } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      login({
        email: values.email,
        password: values.password
      }, {
        onSuccess: () => {
          router.push("/account");
        }
      });
    },
  });

  return (
    <AuthFormWrapper
      title="Login"
      subtitle="Please enter your e-mail and password:"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          size="lg"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
          isRequired
        />

        <PasswordInput
          name="password"
          placeholder="Password"
          size="lg"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : undefined
          }
          isRequired
        />

        <Link 
          href="/reset-password-request" 
          className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors block self-end -mt-1 sm:-mt-2"
        >
          Forgot your password?
        </Link>

        <Button 
          type="submit" 
          className="mt-3 sm:mt-4 w-full text-sm sm:text-base py-2 sm:py-3"
          isLoading={isPending}
        >
          Login
        </Button>

        {(Object.keys(formik.errors).length > 0 && formik.submitCount > 0) && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <div>
              Please enter valid credentials to continue
            </div>
          </div>
        )}
        
        {isError && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <div>
              {error instanceof Error ? error.message : "Login failed. Please check your credentials."}
            </div>
          </div>
        )}
      </form>
    </AuthFormWrapper>
  );
};

export default Login;