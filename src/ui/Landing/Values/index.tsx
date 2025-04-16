import { FaHeart, FaStar, FaCheck } from "react-icons/fa";
import Value from "./value";

interface ValueType {
  title: string;
  description: string;
  Icon: React.ElementType;
}

const valuesData: ValueType[] = [
  {
    title: "Quality",
    description: "We ensure the highest standards in everything we do.",
    Icon: FaStar,
  },
  {
    title: "Trust",
    description:
      "Building strong and reliable relationships with our customers.",
    Icon: FaHeart,
  },
  {
    title: "Commitment",
    description: "Dedicated to delivering the best results consistently.",
    Icon: FaCheck,
  },
];

const ValuesList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-12">
        {valuesData.map((value, index) => (
          <Value key={index} {...value} />
        ))}
      </div>
    </div>
  );
};

export default ValuesList;
