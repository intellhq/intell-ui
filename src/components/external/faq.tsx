"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { MARKETING_FAQS } from "@/constants/faqs";

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
          className="mb-12 flex w-full flex-col text-left"
        >
          <h2 className="max-w-xl text-[32px] leading-tight font-bold md:text-[48px]">
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </h2>
        </motion.div>
        <div className="flex w-full flex-col gap-6 lg:w-209.75">
          {MARKETING_FAQS.map((faq, index) => (
            <motion.div
              key={faq.question}
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
              <button
                type="button"
                className="flex cursor-pointer items-center justify-between py-5 text-left"
                onClick={() => toggleFaq(index)}
              >
                <h2 className="text-secondary text-xl font-semibold">
                  {faq.question}
                </h2>
                <motion.span
                  animate={{ rotate: openIndex === index ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={
                      openIndex === index
                        ? "/images/cross.svg"
                        : "/images/plus.svg"
                    }
                    alt={openIndex === index ? "Collapse" : "Expand"}
                    width={32}
                    height={32}
                    className="size-8"
                  />
                </motion.span>
              </button>

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
