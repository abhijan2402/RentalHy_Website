import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useAddPropertyViewMutation } from "../redux/api/propertyApi";
import ConventionHallDetails from "../components/ConventionSpace/ConventionHall/ConventionHallDetails";
import { useGetconventionDetailsQuery } from "../redux/api/conventionApi";
import HostelDetails from "../components/Hostel/HostelDetails";

export default function HostelDetailsPage() {
  const { id } = useParams();

  // Fetch property details from API
  const { data: property, isLoading, error } = useGetconventionDetailsQuery(id);
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
      <Breadcrumb propertyTitle={"Hostel details"} />
      <HostelDetails
        property={property?.data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
