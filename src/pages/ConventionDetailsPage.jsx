import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useAddPropertyViewMutation } from "../redux/api/propertyApi";
import ConventionHallDetails from "../components/ConventionSpace/ConventionHall/ConventionHallDetails";
import { useGetconventionDetailsQuery } from "../redux/api/conventionApi";
import { useNavbar } from "../contexts/NavbarContext";

export default function ConventionDetailsPage() {
  const { activeMain } = useNavbar();
  console.log(activeMain);
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

  const nav = activeMain === "Resort/Farm House" ? "/farm-resort" : "/convention";

  return (
    <div className="mt-[120px]">
      <Breadcrumb
        breadcrumbItems={[
          { title: "Home", to: "/" },
          { title: `${activeMain}`, to: `${nav}` },
          { title: `${property?.data?.title} details` },
        ]}
      />
      <ConventionHallDetails
        property={property?.data}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
