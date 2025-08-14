import { useParams } from "react-router-dom";
import { propertyData } from "../utils/propertydata";
import PropertyDetails from "../components/Properties/PropertyDetails";
import Breadcrumb from "../components/Breadcrumb";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const property = propertyData.find((p) => p.id === Number(id));

  if (!property) return <p>Property not found</p>;

  return (
    <div className="mt-[100px]">
      <Breadcrumb propertyTitle={"Property details"} />
      <PropertyDetails property={property} />
    </div>
  );
}
