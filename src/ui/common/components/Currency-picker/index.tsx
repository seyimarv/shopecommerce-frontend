import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  type Option,
} from "../Select";
import { useRegion } from "@/lib/context/region-context";
import { useUpdateCart } from "@/lib/data/cart";
import { HttpTypes } from "@medusajs/types";

interface CurrencyPickerProps {
  regions: HttpTypes.StoreRegion[] | undefined;
}

export default function CurrencyPicker({ regions }: CurrencyPickerProps) {
  const { countryCode, setCountryCode, setStoredCountryCode } = useRegion();
  const { mutate: updateCart, isPending } = useUpdateCart();

  const selectRegion = (countryCode: string) => {
    return regions?.find((region) =>
      region.countries?.some((country) => country.iso_2 === countryCode)
    );
  }

  const selectedRegion = selectRegion(countryCode)


  const formatCountryOption = (
    countryCode: string,
    region: HttpTypes.StoreRegion | undefined
  ): Option => ({
    value: countryCode || "",
    label: `${region?.countries?.find((country) => country.iso_2 === countryCode)?.display_name || ""} (${region?.currency_code?.toUpperCase() || ""})`,
  });

  const handleChange = (option: Option | null) => {
    if (option) {
      setCountryCode(option.value.toString());
      setStoredCountryCode(option.value.toString());
      const selectedRegion = selectRegion(option.value.toString());
      updateCart(
        {
          region_id: selectedRegion?.id || '',
        },
        {
          onSuccess: () => {
            window.location.reload();
          }
        }
      );
    }
  };

  return (
    <Select
      value={
        selectedRegion
          ? formatCountryOption(countryCode, selectedRegion)
          : undefined
      }
      onChange={handleChange}
    >
      <SelectTrigger className="whitespace-nowrap !w-fit" />
      <SelectContent className="md:max-h-[200px]">
        {regions?.map((region: HttpTypes.StoreRegion) =>
          region.countries?.map((country) => (
            <SelectItem
              key={country.iso_2}
              value={country.iso_2 || ""}
              label={`${country.display_name || ""} (${region.currency_code?.toUpperCase() || ""
                })`}
            >
              <span className="capitalize whitespace-nowrap">{country.display_name || ""}</span>
              <span className="uppercase">({region.currency_code?.toUpperCase() || ""})</span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
