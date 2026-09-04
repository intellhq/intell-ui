"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const faqData = [
  {
    question: "Do I need to install new hardware?",
    answer:
      "No, you don’t need to install any new hardware. INTELL works with your existing inverter and solar setup. You simply connect your system details or integrate with supported inverter platforms to start monitoring your energy in real time.",
  },
  {
    question: "Which inverter brands are supported?",
    answer:
      "INTELL supports a wide range of popular inverter brands including Victron, Fronius, Growatt, and more. We are constantly adding support for new platforms.",
  },
  {
    question: "Does the AI agent really speak Pidgin?",
    answer:
      "Yes, our AI agent is trained to understand and respond in Pidgin, making it easier for everyone to interact with their energy data naturally.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. We use industry-standard encryption and security protocols to ensure your energy data and personal information are protected at all times.",
  },
  {
    question: "Can solar installers white‑label INTELL?",
    answer:
      "Yes, we offer white-label solutions for solar installers and distributors. Contact our sales team for more information on our partner programs.",
  },
];

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex w-full justify-center bg-card">
      <div className="flex h-auto min-h-200 w-full max-w-7xl flex-col items-center px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col text-left w-full"
        >
          <h2 className="max-w-xl text-[32px] leading-tight font-bold md:text-[48px]">
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h2>
        </motion.div>
        <div className="flex w-full flex-col gap-6 lg:w-209.75">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="flex flex-col justify-center rounded-[10px] border border-[#E9EFFD] px-5 lg:w-209.75"
            >
              <div
                className="flex cursor-pointer items-center justify-between py-5"
                onClick={() => toggleFaq(index)}
              >
                <h2 className="text-secondary text-xl font-semibold">
                  {faq.question}
                </h2>
                <motion.div
                  animate={{ rotate: openIndex === index ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={
                      openIndex === index
                        ? "/images/cross.svg"
                        : "/images/plus.svg"
                    }
                    alt={openIndex === index ? "cross" : "plus"}
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-grey-dark pb-5">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
