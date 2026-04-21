"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, CheckCircle2, XCircle } from "lucide-react";

type InclusionItem = {
  id: number;
  title: string;
  description: string;
};

type Props = {
  included: InclusionItem[];
  notIncluded: InclusionItem[];
};

export default function InclusionsSection({ included, notIncluded }: Props) {
  return (
    <section className="py-24 px-6 bg-[#f8f5f0] flex justify-center items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Included Card */}
        <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-sm border border-gray-100 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <CheckCircle2 className="text-[#8b7346]" size={28} />
            <h2 className="text-4xl font-serif text-[#2d2d2d]">What's Included</h2>
          </div>

          <ul className="space-y-8">
            {included.map((item) => (
              <li key={item.id} className="flex gap-4">
                <Check className="text-[#8b7346] mt-1 shrink-0" size={18} />
                <div>
                  <h4 className="font-bold text-[#2d2d2d]">{item.title}</h4>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Included Card */}
        <motion.div
          initial={{ zIndex: 0, scale: 0.95, opacity: 0.8 }}
          whileHover={{
            zIndex: 20,
            scale: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          className="p-10 md:p-16 rounded-[3rem] bg-transparent border border-dashed border-gray-300 relative group cursor-default lg:-ml-12"
        >
          <div className="absolute inset-0 bg-white/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 shadow-xl" />

          <div className="flex items-center gap-3 mb-12">
            <XCircle className="text-gray-400" size={28} />
            <h2 className="text-4xl font-serif text-gray-400 group-hover:text-[#2d2d2d] transition-colors">
              Not Included
            </h2>
          </div>

          <ul className="space-y-8 text-gray-400 group-hover:text-gray-600 transition-colors">
            {notIncluded.map((item) => (
              <li key={item.id} className="flex gap-4">
                <X className="mt-1 shrink-0 opacity-50" size={18} />
                <div>
                  <h4 className="font-bold group-hover:text-[#2d2d2d] transition-colors">{item.title}</h4>
                  <p className="text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}