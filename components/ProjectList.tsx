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
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

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
                <TableCell className="font-medium">
                  {project.fileDisplayName || project.fileName}
                </TableCell>
                <TableCell>
                  {new Date(project.uploadedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatFileSize(project.size)}</TableCell>
                <TableCell>
                  {project.transactionAmount
                    ? `${project.transactionAmount} ${project.transactionCurrency}`
                    : "_"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${project.status === "pending" ? "bg-yellow-100 text-yellow-800" : project.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="tet-right">
                  <ChevronRight className="h-5 w-5 tet-gray-400 ml-auto" />
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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
