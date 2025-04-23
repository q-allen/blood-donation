// src/app/DonateForm/page.tsx
import { Suspense } from "react";
import DonateFormContent from "../components/DonateFormContent/page";

export default function DonateFormPage() {
  return (
    <Suspense fallback={<div>Loading donation form...</div>}>
      <DonateFormContent />
    </Suspense>
  );
}