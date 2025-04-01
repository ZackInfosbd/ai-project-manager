import DocumentDropzone from "@/components/DocumentDropezone";
import ProjectsList from "@/components/ProjectList";

function page() {
  return (
    <div className="container px-4 py-10 sm:px-6 mx-auto lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <DocumentDropzone />
        <ProjectsList />
      </div>
    </div>
  );
}
export default page;
