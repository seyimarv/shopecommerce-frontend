import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "@/ui/common/components/Select";
import Link from "next/link";

interface LinkDropdownProps {
  links: Option[];
  path: string;
  title: string;
}

const LinkDropdown: React.FC<LinkDropdownProps> = ({ links, path, title }) => {
  const [selected, setSelected] = useState<Option | undefined>();

  return (
    <Select
      value={selected}
      onChange={(option: Option) => setSelected(option)}
      hover
    >
      <SelectTrigger className="border-none !p-0 !text-sm !py-[0rem]" as="a" href={path} title={title} hideIcon />
      <SelectContent className="max-h-[200px] !w-fit">
        {links.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            as={Link}
            href={option.href}
            label={option.label}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LinkDropdown;
