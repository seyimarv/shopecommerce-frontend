import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "../Select";

const currencies = [
  { value: "AED", label: "🇦🇪 AED" },
  { value: "AFN", label: "🇦🇫 AFN" },
  { value: "ALL", label: "🇦🇱 ALL" },
  { value: "AMD", label: "🇦🇲 AMD" },
  { value: "ANG", label: "🇳🇱 ANG" },
  { value: "AOA", label: "🇦🇴 AOA" },
  { value: "ARS", label: "🇦🇷 ARS" },
  { value: "AUD", label: "🇦🇺 AUD" },
  { value: "AWG", label: "🇦🇼 AWG" },
  { value: "AZN", label: "🇦🇿 AZN" },
  { value: "BAM", label: "🇧🇦 BAM" },
  { value: "BBD", label: "🇧🇧 BBD" },
  { value: "BDT", label: "🇧🇩 BDT" },
  { value: "BGN", label: "🇧🇬 BGN" },
  { value: "BHD", label: "🇧🇭 BHD" },
  { value: "BIF", label: "🇧🇮 BIF" },
  { value: "BMD", label: "🇧🇲 BMD" },
  { value: "BND", label: "🇧🇳 BND" },
  { value: "BOB", label: "🇧🇴 BOB" },
  { value: "BRL", label: "🇧🇷 BRL" },
  { value: "BSD", label: "🇧🇸 BSD" },
  { value: "BTN", label: "🇧🇹 BTN" },
  { value: "BWP", label: "🇧🇼 BWP" },
  { value: "BYN", label: "🇧🇾 BYN" },
  { value: "BZD", label: "🇧🇿 BZD" },
  { value: "CAD", label: "🇨🇦 CAD" },
  { value: "CDF", label: "🇨🇩 CDF" },
  { value: "CHF", label: "🇨🇭 CHF" },
  { value: "CLP", label: "🇨🇱 CLP" },
  { value: "CNY", label: "🇨🇳 CNY" },
  { value: "COP", label: "🇨🇴 COP" },
  { value: "CRC", label: "🇨🇷 CRC" },
  { value: "CUP", label: "🇨🇺 CUP" },
  { value: "CVE", label: "🇨🇻 CVE" },
  { value: "CZK", label: "🇨🇿 CZK" },
  { value: "DJF", label: "🇩🇯 DJF" },
  { value: "DKK", label: "🇩🇰 DKK" },
  { value: "DOP", label: "🇩🇴 DOP" },
  { value: "DZD", label: "🇩🇿 DZD" },
  { value: "EGP", label: "🇪🇬 EGP" },
  { value: "ERN", label: "🇪🇷 ERN" },
  { value: "ETB", label: "🇪🇹 ETB" },
  { value: "EUR", label: "🇪🇺 EUR" },
  { value: "FJD", label: "🇫🇯 FJD" },
  { value: "FKP", label: "🇫🇰 FKP" },
  { value: "FOK", label: "🇫🇴 FOK" },
  { value: "GBP", label: "🇬🇧 GBP" },
  { value: "GEL", label: "🇬🇪 GEL" },
  { value: "GGP", label: "🇬🇬 GGP" },
  { value: "GHS", label: "🇬🇭 GHS" },
  { value: "GIP", label: "🇬🇮 GIP" },
  { value: "GMD", label: "🇬🇲 GMD" },
  { value: "GNF", label: "🇬🇳 GNF" },
  { value: "GTQ", label: "🇬🇹 GTQ" },
  { value: "GYD", label: "🇬🇾 GYD" },
  { value: "HKD", label: "🇭🇰 HKD" },
  { value: "HNL", label: "🇭🇳 HNL" },
  { value: "HRK", label: "🇭🇷 HRK" },
  { value: "HTG", label: "🇭🇹 HTG" },
  { value: "HUF", label: "🇭🇺 HUF" },
  { value: "IDR", label: "🇮🇩 IDR" },
  { value: "ILS", label: "🇮🇱 ILS" },
  { value: "IMP", label: "🇮🇲 IMP" },
  { value: "INR", label: "🇮🇳 INR" },
  { value: "IQD", label: "🇮🇶 IQD" },
  { value: "IRR", label: "🇮🇷 IRR" },
  { value: "ISK", label: "🇮🇸 ISK" },
  { value: "JEP", label: "🇯🇪 JEP" },
  { value: "JMD", label: "🇯🇲 JMD" },
  { value: "JOD", label: "🇯🇴 JOD" },
  { value: "JPY", label: "🇯🇵 JPY" },
  { value: "KES", label: "🇰🇪 KES" },
  { value: "KGS", label: "🇰🇬 KGS" },
  { value: "KHR", label: "🇰🇭 KHR" },
  { value: "KMF", label: "🇰🇲 KMF" },
  { value: "KPW", label: "🇰🇵 KPW" },
  { value: "KRW", label: "🇰🇷 KRW" },
  { value: "KWD", label: "🇰🇼 KWD" },
  { value: "KYD", label: "🇰🇾 KYD" },
  { value: "KZT", label: "🇰🇿 KZT" },
  { value: "LAK", label: "🇱🇦 LAK" },
  { value: "LBP", label: "🇱🇧 LBP" },
  { value: "LKR", label: "🇱🇰 LKR" },
  { value: "LRD", label: "🇱🇷 LRD" },
  { value: "LSL", label: "🇱🇸 LSL" },
  { value: "LYD", label: "🇱🇾 LYD" },
  { value: "MAD", label: "🇲🇦 MAD" },
  { value: "MDL", label: "🇲🇩 MDL" },
  { value: "MGA", label: "🇲🇬 MGA" },
  { value: "MKD", label: "🇲🇰 MKD" },
  { value: "MMK", label: "🇲🇲 MMK" },
  { value: "MNT", label: "🇲🇳 MNT" },
  { value: "MUR", label: "🇲🇺 MUR" },
  { value: "MWK", label: "🇲🇼 MWK" },
  { value: "MXN", label: "🇲🇽 MXN" },
  { value: "MYR", label: "🇲🇾 MYR" },
  { value: "MZN", label: "🇲🇿 MZN" },
  { value: "NAD", label: "🇳🇦 NAD" },
  { value: "NGN", label: "🇳🇬 NGN" },
  { value: "NPR", label: "🇳🇵 NPR" },
  { value: "NZD", label: "🇳🇿 NZD" },
  { value: "OMR", label: "🇴🇲 OMR" },
  { value: "PEN", label: "🇵🇪 PEN" },
  { value: "PKR", label: "🇵🇰 PKR" },
  { value: "PLN", label: "🇵🇱 PLN" },
];

export default function CurrencyPicker() {
  const [selected, setSelected] = useState<Option | undefined>(currencies[0]);

  return (
    <Select value={selected} onChange={setSelected}>
      <SelectTrigger className="" />
      <SelectContent className="max-h-[200px]">
        {currencies.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            label={option.label}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
