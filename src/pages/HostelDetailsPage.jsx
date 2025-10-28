import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useAddPropertyViewMutation } from "../redux/api/propertyApi";
import HostelDetails from "../components/Hostel/HostelDetails";
import { useGetHostelDetailsQuery } from "../redux/api/hostelApi";

export default function HostelDetailsPage() {
  const { id } = useParams();

  // Fetch property details from API
  const { data: property, isLoading, error } = useGetHostelDetailsQuery(id);
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
    <div className="mt-[120px]">
      <Breadcrumb
        breadcrumbItems={[
          { title: "Home", to: "/" },
          { title: "Hostel", to: "/hostel" },
          { title: "Hostel details" },
        ]}
      />
      <HostelDetails
        property={property?.data}
        reviews={property?.review_stats}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
