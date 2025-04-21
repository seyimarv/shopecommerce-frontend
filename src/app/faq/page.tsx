"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping usually takes between 3-7 business days depending on your location. We'll send tracking details once your order ships.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Please contact support to start a return.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship internationally! Shipping rates and times vary depending on your country.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing an order, you will receive an email with a tracking link once your package ships.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "We process orders quickly, but if you need to make changes or cancel, please contact us within 2 hours of placing your order.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full h-lvh">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Frequently Asked Questions
      </h1>
      <div className="space-y-6 w-full">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 w-full"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span className="text-lg text-gray-800 text-left break-words w-full">
                {faq.question}
              </span>
              <span className="text-gray-500 ml-4">
                {openIndex === index ? (
                  <FiChevronUp size={24} />
                ) : (
                  <FiChevronDown size={24} />
                )}
              </span>
            </button>
            <div
              className={`transition-all duration-5 ease-in-out overflow-hidden w-full ${
                openIndex === index ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="px-5 pb-5 pt-0 text-gray-600 text-sm w-full">
                {openIndex === index && (
                  <div className="py-2 break-words">{faq.answer}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
