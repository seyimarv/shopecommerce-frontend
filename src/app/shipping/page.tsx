import Link from "next/link";
import Button from "@/ui/common/components/button";

export default function ShippingAndReturnsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="text-center mb-20">
        <h1 className="text-3xl font-bold mb-4">Shipping & Returns</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about how we get your products to you —
          and what to do if you need to make a return.
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-10 mb-20">
        <div className="bg-white shadow-xl rounded-2xl p-10 ">
          <h2 className="text-2xl font-semibold mb-6 text-primary">
            Shipping Information
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            We process and ship all orders within 1-3 business days. Once
            shipped, you will receive an email with your tracking number.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-left">
            <li>
              <span className="font-medium">Domestic:</span> 3-7 business days.
            </li>
            <li>
              <span className="font-medium">International:</span> 7-21 business
              days depending on location.
            </li>
            <li>
              <span className="font-medium">Shipping Rates:</span> Calculated at
              checkout based on your address.
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-10 ">
          <h2 className="text-2xl font-semibold mb-6 text-primary">
            Returns & Exchanges
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            If you're not completely satisfied, we offer hassle-free returns
            within 30 days of delivery.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-left">
            <li>
              <span className="font-medium">Condition:</span> Items must be
              unused and in original packaging.
            </li>
            <li>
              <span className="font-medium">Return Costs:</span> Customer is
              responsible unless item is defective.
            </li>
            <li>
              <span className="font-medium">Refunds:</span> Issued within 5-7
              business days after return is received.
            </li>
          </ul>
        </div>
      </section>

      <section className="">
        <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-6">
          Contact our friendly support team for any shipping or return
          questions!
        </p>
        <Link href="/contact">
          <Button>Contact Support</Button>
        </Link>
      </section>
    </div>
  );
}
