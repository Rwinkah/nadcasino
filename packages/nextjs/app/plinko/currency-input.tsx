"use client";

import { useState } from "react";
import { Input } from "~~/components/ui/input";

export default function CurrencyInput() {
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    const val = e.target.value;
    // Ensure only valid decimal numbers are entered
    if (/^\d*\.?\d*$/.test(val)) {
      setValue(val);
    }
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*\.?[0-9]*"
      value={value}
      onChange={handleChange}
      placeholder="0.000000000000"
      className="min-w-[60%] border-none outline-none rounded-none  bg-[#09011C] font-medium text-white h-full"
    />
  );
}
