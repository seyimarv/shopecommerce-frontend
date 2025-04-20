import { SelectTriggerBase, SelectContentBase } from '@/ui/common/components/Select';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { HttpTypes } from '@medusajs/types';

interface AddressSelectProps {
    addresses: HttpTypes.StoreCustomerAddress[];
    onSelect: (address: HttpTypes.StoreCustomerAddress | null) => void;
}

const AddressSelect: React.FC<AddressSelectProps> = ({ addresses, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<HttpTypes.StoreCustomerAddress | null>(null);

    const handleSelect = (address: HttpTypes.StoreCustomerAddress) => {
        setSelectedAddress(address);
        onSelect(address);
        setIsOpen(false);
    };

    useEffect(() => {
        if (selectedAddress && !addresses.find(a => a.id === selectedAddress.id)) {
            setSelectedAddress(null);
            onSelect(null);
        }
        if (!addresses || addresses.length === 0) {
            setIsOpen(false);
        }
    }, [addresses, selectedAddress, onSelect]);


    const getTriggerTitle = () => {
        if (selectedAddress) {
            return `${selectedAddress.first_name} ${selectedAddress.last_name}, ${selectedAddress.address_1}, ${selectedAddress.city}`;
        }
        return "Select a saved address";
    };

    const selectRef = useOnClickOutside<HTMLDivElement>(() => setIsOpen(false));

    return (
        <div className={`relative`} ref={selectRef}>
            <SelectTriggerBase
                title={getTriggerTitle()}
                onClick={() => addresses && addresses.length > 0 && setIsOpen((prev) => !prev)}
                className="w-full border-gray-300"
                open={isOpen}
            />
            <AnimatePresence mode="wait">
                {isOpen && (
                    <SelectContentBase
                        className=""
                    >
                        {addresses && addresses.length > 0 ? (
                            addresses.map((address: HttpTypes.StoreCustomerAddress) => (
                                <div
                                    key={address.id}
                                    onClick={() => handleSelect(address)}
                                    className={`flex cursor-pointer items-start gap-x-3 p-3 transition-colors hover:bg-gray-100 ${selectedAddress?.id === address.id ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        readOnly
                                        checked={selectedAddress?.id === address.id}
                                        className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-semibold">
                                            {address.first_name} {address.last_name}
                                        </span>
                                        <span>
                                            {address.address_1}
                                            {address.address_2 ? `, ${address.address_2}` : ''}
                                        </span>
                                        <span>
                                            {address.city}, {address.province ? `${address.province} ` : ''}
                                            {address.postal_code}
                                        </span>
                                        <span>{address.country_code?.toUpperCase()}</span>
                                        {address.phone && <span>{address.phone}</span>}
                                        {address.company && <span className="text-xs text-gray-500">{address.company}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-gray-500">
                                No saved addresses found for this region.
                            </div>
                        )}
                    </SelectContentBase>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddressSelect;