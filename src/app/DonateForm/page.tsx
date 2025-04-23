import { Suspense } from "react";
import DonateFormContent from "../../components/DonateFormContent";

// Define the props type correctly
interface DonateFormPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DonateFormPage({ searchParams }: DonateFormPageProps) {
  // Await searchParams since it's a Promise
  const resolvedSearchParams = await searchParams;

  // Extract values with type guards
  const id = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : "";
  const name = typeof resolvedSearchParams.name === "string" ? resolvedSearchParams.name : "";
  const description = typeof resolvedSearchParams.description === "string" ? resolvedSearchParams.description : "";
  const location = typeof resolvedSearchParams.location === "string" ? resolvedSearchParams.location : "";
  const image = typeof resolvedSearchParams.image === "string" ? resolvedSearchParams.image : "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonateFormContent
        id={id}
        name={name}
        description={description}
        location={location}
        image={image}
      />
    </Suspense>
  );
}