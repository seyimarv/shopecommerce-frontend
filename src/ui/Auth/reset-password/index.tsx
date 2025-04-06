"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import AuthFormWrapper from "@/ui/Auth/AuthForm";
import Button from "@/ui/common/components/button";
import Link from "next/link";
import { PasswordInput } from "@/ui/common/components/input/password-input";
import { useUpdatePassword } from "@/lib/data/customer";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: updatePassword, isPending, isError, error, isSuccess } = useUpdatePassword();
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      if (!emailParam || !tokenParam) {
        return;
      }
      
      updatePassword({
        email: emailParam,
        password: values.password,
        token: tokenParam
      }, {
        onSuccess: () => {
          // Wait a bit before redirecting to allow user to see success message
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      });
    },
  });

  return (
    <AuthFormWrapper
      title="Reset Password"
      subtitle="Enter your new password below:"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {emailParam && (
          <div className="text-sm text-gray-600 mb-2">
            Resetting password for: <span className="font-medium">{emailParam}</span>
          </div>
        )}
        
        <PasswordInput
          name="password"
          placeholder="New Password"
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

        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm New Password"
          size="lg"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : undefined
          }
          isRequired
        />

        <Button 
          type="submit" 
          className="mt-4 w-full"
          isLoading={isPending}
          disabled={!emailParam || !tokenParam}
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
              Please fix the errors above
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
              Password successfully reset! You will be redirected to the login page.
            </div>
          </div>
        )}

        {(!emailParam || !tokenParam) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-600 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" />
            <div>
              Invalid or missing reset information. Please use the link from your email.
            </div>
          </div>
        )}
      </form>
    </AuthFormWrapper>
  );
};

export default ResetPassword;