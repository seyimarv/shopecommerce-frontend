import React from "react";

const CartTableSkeleton: React.FC = () => {
    return (
        <>
            <div className="space-y-4 md:hidden">
                <div className="grid grid-cols-2 border-b border-gray-200 pb-2 mb-4">
                    <div className="text-left font-medium text-gray-900 uppercase text-sm">Product</div>
                    <div className="text-right font-medium text-gray-900 uppercase text-sm">Total</div>
                </div>
                {[...Array(3)].map((_, index) => (
                    <div key={`mobile-skeleton-${index}`} className="grid grid-cols-2 pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex gap-3 items-start">
                            <div className="w-16 h-20 bg-gray-200 animate-pulse rounded" />
                            <div className="flex flex-col gap-2 pt-1">
                                <div className="w-32 h-5 bg-gray-200 animate-pulse rounded" />
                                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                                <div className="w-20 h-6 mt-2 bg-gray-200 animate-pulse rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between pt-1">
                            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded" />
                            <div className="w-6 h-6 mt-auto bg-gray-200 animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
            <table className="hidden md:table w-full text-left text-sm">
                <thead>
                    <tr className="text-secondary font-light">
                        <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-left">Product</th>
                        <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-left">Quantity</th>
                        <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(3)].map((_, index) => (
                        <tr key={`desktop-skeleton-${index}`} className="border-t border-gray-300">
                            <td className="px-4 py-8 align-top flex gap-4 text-left">
                                <div className="w-25 h-20 bg-gray-200 animate-pulse" />
                                <div>
                                    <div className="w-40 h-6 mb-2 bg-gray-200 animate-pulse" />
                                    <div className="w-20 h-4 bg-gray-200 animate-pulse" />
                                </div>
                            </td>
                            <td className="px-4 py-8 align-top text-center">
                                <div className="w-20 h-8 mx-auto bg-gray-200 animate-pulse" />
                            </td>
                            <td className="px-4 py-8 align-top text-right">
                                <div className="flex flex-col justify-center items-end gap-2">
                                    <div className="w-20 h-6 bg-gray-200 animate-pulse" />
                                    <div className="w-8 h-8 bg-gray-200 animate-pulse" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default CartTableSkeleton;
