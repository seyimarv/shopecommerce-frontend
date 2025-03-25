import React from "react";

const CartTableSkeleton: React.FC = () => {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="text-secondary font-light">
                    <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-left">Product</th>
                    <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-left">Quantity</th>
                    <th className="px-4 py-4 font-normal text-gray-900 uppercase text-sm text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(3)].map((_, index) => (
                    <tr key={index} className="border-t border-gray-300">
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
    );
};

export default CartTableSkeleton;
