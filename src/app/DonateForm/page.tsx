import { Suspense } from "react";
import DonateFormContent from "../components/DonateFormContent";

export default function DonateFormPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const id = Array.isArray(searchParams.id) ? searchParams.id.join(", ") : searchParams.id || "";
  const name = Array.isArray(searchParams.name) ? searchParams.name.join(", ") : searchParams.name || "";
  const description = Array.isArray(searchParams.description) ? searchParams.description.join(", ") : searchParams.description || "";
  const location = Array.isArray(searchParams.location) ? searchParams.location.join(", ") : searchParams.location || "";
  const image = Array.isArray(searchParams.image) ? searchParams.image.join(", ") : searchParams.image || "";

  return (
    <Suspense fallback={<div>Loading donation form...</div>}>
      <DonateFormContent id={id} name={name} description={description} location={location} image={image} />
    </Suspense>
  );
}