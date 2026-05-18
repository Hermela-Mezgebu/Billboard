"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does the billing work?",
    answer:
      "Springerdata offers monthly, annual, and pay-as-you-go pricing. Payments are made securely online using supported payment methods.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription anytime without penalties.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Refunds depend on the plan and usage. Contact support for details.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a limited free trial for new users.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept credit cards and other secure online payment methods.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full mx-auto py-10 text-white">
      <div className="w-[80%] mx-auto space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden border-b-2 border-gray-800"
            >
              {/* HEADER */}
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between bg-gray-800 px-4 py-4 text-left"
              >
                <span className="text-lg font-medium">
                  {faq.question}
                </span>

                <ChevronDown
                  className={cn(
                    "transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* CONTENT */}
              <div
                className={cn(
                  "px-4 text-neutral-200 transition-all duration-300 overflow-hidden",
                  isOpen ? "max-h-40 py-3" : "max-h-0"
                )}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}