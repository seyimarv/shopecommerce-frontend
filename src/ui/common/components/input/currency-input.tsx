import { Input, InputProps } from ".";
import { FaEuroSign } from "react-icons/fa";

export default function CurrencyInput({ ...props }: InputProps) {
  return (
    <Input
      type="number"
      startContent={<FaEuroSign className="text-gray-500" />}
      {...props}
    />
  );
}
