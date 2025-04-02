"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

const ProjectList = () => {
  const { user } = useUser();
  const projects = useQuery(api.projects.getProjectsById, {
    userId: user?.id || "",
  });
  const router = useRouter();

  if (!user) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-600">Please sign in t view your projects.</p>
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin ronded-full h-10 w-10 border-t-2 brder-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Lading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-600">No projects have been uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Your projects</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project: Doc<"projects">) => (
              <TableRow
                key={project._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  router.push(`/project/${project._id}`);
                }}
              >
                <TableCell className="py-2">
                  <FileText className="h-6 w-6 text-red-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectList;
