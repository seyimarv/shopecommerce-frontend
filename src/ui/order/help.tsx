import Link from "next/link";

const HelpSection = () => {
  return (
    <div className="my-3">
      <h3 className="font-medium text-lg md:text-xl mb-1">Need help?</h3>
      <Link href="/contact" className="text-base md:text-lg hover:underline">
        Contact Us
      </Link>
    </div>
  );
};

export default HelpSection;
