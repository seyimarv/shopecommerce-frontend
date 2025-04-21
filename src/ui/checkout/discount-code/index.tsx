import { useApplyPromotions, useRetrieveCart } from "@/lib/data/cart";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/ui/common/components/input";
import Button from "@/ui/common/components/button";
import { FiAlertCircle } from "react-icons/fi";
import DeleteButton from "@/ui/common/components/button/delete-button";
import { convertToLocale } from "@/lib/utils/money";
import { FaTag } from 'react-icons/fa';
import { RiCouponLine } from 'react-icons/ri';

const DiscountCodeSchema = Yup.object().shape({
    code: Yup.string().required("Promo code cannot be empty"),
});

const DiscountCode = () => {
    const { data: cart } = useRetrieveCart()
    const [deletingCode, setDeletingCode] = useState<string | null>(null);
    const {
        mutate: applyCode,
        isPending,
        isError: isApplyError,
        error: applyError,
        reset,
    } = useApplyPromotions({ prevPromtions: cart?.promotions || [] });

    const removePromotionCode = async (codeToRemove: string) => {
        const appliedCodes = cart?.promotions || [];
        if (!cart) return;
        setDeletingCode(codeToRemove);
        const remainingCodes = appliedCodes
            .map((p) => p.code)
            .filter((code): code is string => code !== undefined && code !== codeToRemove);
        applyCode(remainingCodes, {
            onSuccess: () => {
                reset();
                setDeletingCode(null);
            },
            onError: (err) => {
                console.error("Error removing promotion code:", err);
                setDeletingCode(null);
            }
        });
    };

    const formik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: DiscountCodeSchema,
        onSubmit: (values, { resetForm }) => {
            reset();
            if (!cart) return;

            const existingCodes = cart.promo_codes?.map((pc) => pc.code) || [];
            const newCodes = [...new Set([...existingCodes, values.code])];

            applyCode(newCodes, {
                onSuccess: () => {
                    resetForm();
                },
                onError: (err) => {
                    console.error("Error applying promotion code:", err);
                }
            });
        },
    });

    return (
        <div className="w-full bg-white py-4 flex flex-col gap-y-4">
            {cart?.promotions && cart?.promotions?.length > 0 && (
                <div className="flex flex-col gap-y-2">
                    <p className="text-sm text-xl text-gray-700">Applied Promos</p>
                    <ul className="flex flex-col gap-y-1">
                        {cart?.promotions?.map((promotion: any) => {
                            if (!promotion) return null;
                            const discountValue = promotion.application_method?.value;
                            const discountType = promotion.application_method?.type;
                            const currencyCode = promotion.application_method?.currency_code;
                            const isAutomatic = promotion.is_automatic;

                            let formattedDiscount = "";
                            if (discountValue !== undefined) {
                                if (discountType === "percentage") {
                                    formattedDiscount = `${discountValue}%`;
                                } else if (currencyCode) {
                                    formattedDiscount = convertToLocale({
                                        amount: discountValue,
                                        currency_code: currencyCode,
                                    });
                                }
                            }

                            return (
                                <li
                                    key={promotion.id}
                                    className="flex justify-between items-center text-sm text-gray-600 p-2"
                                >
                                    <div className="flex items-center gap-x-2 flex-grow min-w-0">
                                        <FaTag className="flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold truncate" title={promotion.code}>{promotion.code}</span>
                                            {formattedDiscount && (
                                                <span className="text-xs text-gray-600">
                                                    Discount: {formattedDiscount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {!isAutomatic && promotion.code && (
                                        <div className="flex-shrink-0 pl-2">
                                            <DeleteButton
                                                onClick={() => removePromotionCode(promotion.code!)}
                                                isLoading={deletingCode === promotion.code}
                                                disabled={deletingCode !== null || isPending}
                                                size="small"
                                            />
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="items-center flex gap-x-2">
                <div className="relative flex-grow">
                    <Input
                        name="code"
                        type="text"
                        placeholder="Enter promo code"
                        value={formik.values.code}
                        onChange={(e) => {
                            reset();
                            formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        className="pl-10 w-full"
                        disabled={isPending || deletingCode !== null}
                        autoComplete="off"
                        startContent={<RiCouponLine className="h-5 w-5 text-gray-400" />}
                    />
                </div>
                <div className="w-1/4 flex-shrink-0">
                    <Button
                        type="submit"
                        variant="secondary"
                        className="whitespace-nowrap !min-w-full"
                        isLoading={isPending}
                        disabled={!formik.dirty || !formik.isValid || isPending || deletingCode !== null}
                    >
                        Apply
                    </Button>
                </div>
            </form>

            {(formik.touched.code && formik.errors.code || isApplyError) && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-2">
                    <FiAlertCircle className="mt-0.5 flex-shrink-0" />
                    <div>
                        {formik.touched.code && formik.errors.code ? formik.errors.code :
                            applyError instanceof Error ? applyError.message : "Failed to apply discount code."}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscountCode;