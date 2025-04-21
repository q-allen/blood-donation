"use client";

import { useState } from "react";

interface StepperProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  children: React.ReactNode;
}

export const Stepper = ({ activeStep, setActiveStep, children }: StepperProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        {children &&
          (children as React.ReactElement[]).map((child, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md ${
                activeStep === index ? "bg-red-600 text-white" : "bg-gray-300"
              }`}
              onClick={() => setActiveStep(index)}
            >
              Step {index + 1}
            </button>
          ))}
      </div>
      <div>{(children as React.ReactElement[])[activeStep]}</div>
    </div>
  );
};

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export const Step = ({ title, children }: StepProps) => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </div>
);
