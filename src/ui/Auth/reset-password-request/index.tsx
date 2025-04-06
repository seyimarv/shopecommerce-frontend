

"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import Button from "@/ui/common/components/button";
import Link from "next/link";
import { useResetPassword } from "@/lib/data/customer";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPassword = () => {
  const { mutate: resetPassword, isPending, isError, error, isSuccess } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      resetPassword({
        email: values.email
      });
    },
  });

  return (
    <AuthFormWrapper
      title="Reset Password"
      subtitle="Enter your email to reset your password:"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
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

        <Button 
          type="submit" 
          className="mt-4 w-full"
          isLoading={isPending}
        >
          Reset Password
        </Button>

        <Link 
          href="/login" 
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors block text-center mt-2"
        >
          Back to Login
        </Link>

        {(Object.keys(formik.errors).length > 0 && formik.submitCount > 0) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <div>
              Please enter a valid email address
            </div>
          </div>
        )}
        
        {isError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <div>
              {error instanceof Error ? error.message : "Password reset failed. Please try again."}
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-start gap-2">
            <div>
              Password reset email sent. Please check your inbox for further instructions.
            </div>
          </div>
        )}
      </form>
    </AuthFormWrapper>
  );
};

export default ResetPassword;
