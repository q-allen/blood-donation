import { Suspense } from "react";
import DonateFormContent from "../../components/DonateFormContent";

// Define the props type explicitly
interface DonateFormPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DonateFormPage({ searchParams }: DonateFormPageProps) {
  // Await searchParams since it's a Promise
  const params = await searchParams;
  
  const id = typeof params.id === "string" ? params.id : "";
  const name = typeof params.name === "string" ? params.name : "";
  const description = typeof params.description === "string" ? params.description : "";
  const location = typeof params.location === "string" ? params.location : "";
  const image = typeof params.image === "string" ? params.image : "";

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