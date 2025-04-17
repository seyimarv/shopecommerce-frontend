"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";
import AuthFormWrapper from "@/ui/Auth/AuthForm";
import { Input } from "@/ui/common/components/input";
import { PasswordInput } from "@/ui/common/components/input/password-input";
import Button from "@/ui/common/components/button";
import { useSignup } from "@/lib/data/customer";
import { useRouter } from "next/navigation";

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "First name is too short")
        .max(50, "First name is too long")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name is too short")
        .max(50, "Last name is too long")
        .required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

const Signup = () => {
    const router = useRouter();
    const signup = useSignup();

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            try {
                await signup.mutateAsync({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName
                });
                router.push("/account");
            } catch (error: any) {
                if (error.toString().includes("already exists")) {
                    formik.setFieldError("email", "An account with this email already exists");
                } else {
                    console.error("Signup error:", error);
                }
            }
        },
    });

    return (
        <AuthFormWrapper
            title="Register"
            subtitle="Please fill in the fields below:"
            type="register"
        >
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                <Input
                    name="firstName"
                    placeholder="First name"
                    size="lg"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                        formik.touched.firstName && formik.errors.firstName
                            ? formik.errors.firstName
                            : undefined
                    }
                    isRequired
                    disabled={signup.isPending}
                />

                <Input
                    name="lastName"
                    placeholder="Last name"
                    size="lg"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                        formik.touched.lastName && formik.errors.lastName
                            ? formik.errors.lastName
                            : undefined
                    }
                    isRequired
                    disabled={signup.isPending}
                />

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
                    disabled={signup.isPending}
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
                    disabled={signup.isPending}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
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
                    disabled={signup.isPending}
                />

                <Button
                    type="submit"
                    className="mt-3 sm:mt-4 w-full text-sm sm:text-base py-2 sm:py-3"
                    disabled={signup.isPending || !(formik.isValid && formik.dirty)}
                    isLoading={signup.isPending}
                >
                   Create account
                </Button>
                {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600 flex items-start gap-2">
                        <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                        <div>
                            Please fix the errors above to continue
                        </div>
                    </div>
                )}
                {signup.isError && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-600 flex items-start gap-2">
                        <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                        <div>
                            {signup.error instanceof Error 
                                ? signup.error.message 
                                : "An error occurred while creating your account"}
                        </div>
                    </div>
                )}
            </form>
        </AuthFormWrapper>
    );
};

export default Signup;