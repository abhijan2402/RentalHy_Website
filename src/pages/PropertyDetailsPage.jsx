import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PropertyDetails from "../components/Properties/PropertyDetails";
import Breadcrumb from "../components/Breadcrumb";
import {
  useAddPropertyViewMutation,
  useGetPropertyDetailsQuery,
} from "../redux/api/propertyApi";

export default function PropertyDetailsPage() {
  const { id } = useParams();

  // Fetch property details from API
  const { data: property, isLoading, error } = useGetPropertyDetailsQuery(id);
  console.log(property);

  // Add view mutation
  const [addPropertyView] = useAddPropertyViewMutation();

  useEffect(() => {
    if (id) {
      addPropertyView(id)
        .unwrap()
        .then((res) => {
          if (res?.status) {
            console.log("View added successfully ✅");
          } else {
            console.warn("View not added ❌", res?.message);
          }
        })
        .catch((err) => {
          if (err?.status !== 409) {
            console.error("Error adding property view:", err);
          }
        });
    }
  }, []);

  return (
    <div className="mt-[100px]">
      <Breadcrumb propertyTitle={"Property details"} />
      <PropertyDetails
        property={property?.data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
