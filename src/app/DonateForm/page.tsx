import { Suspense } from "react";
import DonateFormContent from "../../components/DonateFormContent";

export default function DonateFormPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = typeof searchParams.id === "string" ? searchParams.id : "";
  const name = typeof searchParams.name === "string" ? searchParams.name : "";
  const description = typeof searchParams.description === "string" ? searchParams.description : "";
  const location = typeof searchParams.location === "string" ? searchParams.location : "";
  const image = typeof searchParams.image === "string" ? searchParams.image : "";

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