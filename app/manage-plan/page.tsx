import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  return (
    <div className="container xl:max-w-5xl mx-auto p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-4 my-0">Manage subscriptions</h1>
      <p className="text-gray-600 mb-8">
        Manage your Subs and billing details here.
      </p>
      <SchematicComponent
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_CMPONENT_ID
        }
      />
    </div>
  );
};
export default ManagePlan;
