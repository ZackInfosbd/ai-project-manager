"use client";

import { deleteProject } from "@/actions/deleteProject";
import { getFileDownloadUrl } from "@/actions/getFileDownloadUrl";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSchematicFlag } from "@schematichq/schematic-react";
import { useQuery } from "convex/react";
import { ChevronLeft, FileText, Lightbulb, Lock, Sparkle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Project() {
  const params = useParams<{ id: string }>();
  const [projectId, setProjectId] = useState<Id<"projects"> | null>(null);
  const router = useRouter();
  const isSummariesEnabled = useSchematicFlag("summary");
  const [loadingDownload, setIsLoadingDoanload] = useState<boolean>(false);

  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId } : "skip",
  );

  const fileId = project?.fileId as Id<"_storage"> | undefined;

  const downloadUrl = useQuery(
    api.projects.getProjectDownloadUrl,
    fileId ? { fileId } : "skip",
  );

  const handleDownload = async () => {
    if (!project || !project.fileId) return;
    try {
      setIsLoadingDoanload(true);

      const result = await getFileDownloadUrl(project.fileId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const link = document.createElement("a");

      if (result.downloadUrl) {
        link.href = result.downloadUrl;
        link.download = project.fileName || "project.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("Download URL not found");
      }
    } catch (error) {
    } finally {
      setIsLoadingDoanload(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        const result = await deleteProject(projectId);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.push("/");
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  useEffect(() => {
    try {
      if (params.id) {
        const id = params.id as Id<"projects">;
        setProjectId(id);
      }
    } catch (error) {
      console.error("Error parsing project ID:", error);
      setProjectId(null);
      router.push("/");
    }
  }, [params.id, router]);

  // Loading state
  if (project === undefined) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="mb-6">
            The project you &apos;re looking for does not exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="px-6 bg-blue-500 text-white rounded hover:bg-blue-600 "
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // upload date formatting
  const uploadDate = new Date(project.uploadedAt).toLocaleDateString();

  // check if project has extracted data
  const hasExtractedData = !!(
    project.merchantName ||
    project.merchantAddress ||
    project.transactionDate ||
    project.transactionAmount
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link
            href="/projects"
            className="text-blue-500 hover:underline flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to projects
          </Link>
        </nav>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex- items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-600 truncate">
                {project.fileDisplayName || project.fileName}
              </h1>
              <div className="flex items-center">
                {project.status === "pending" ? (
                  <div className="mr-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                  </div>
                ) : null}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    project.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : project.status === "processed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    File Information
                  </h3>
                  <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Uploaded</p>
                        <p className="font-medium">
                          {formatFileSize(project.size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium">{project.mimeType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID</p>
                        <p className="font-medium truncate" title={project._id}>
                          {project._id.slice(0, 10)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download */}

              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto" />
                  <p className="mt-4 text-sm text-gray-500">PDF Preview</p>
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Extracted Data Section*/}
            {hasExtractedData && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Project details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Relation 1 to project information */}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Team information
                    </h4>
                    <div className="space-y-2">
                      {project.merchantName && (
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium ">{project.merchantName}</p>
                        </div>
                      )}
                    </div>
                    {project.merchantAddress && (
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{project.merchantAddress}</p>
                      </div>
                    )}
                    {project.mercantContact && (
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{project.mercantContact}</p>
                      </div>
                    )}
                  </div>
                  {/* Relation 2 to project information */}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium tet-gray-700 mb-3">
                      Transaction details
                    </h4>
                    <div className="space-y-2">
                      {project.transactionDate && (
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {formatDate(new Date(project.transactionDate))}
                          </p>
                        </div>
                      )}
                      {project.transactionAmount && (
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium">
                            {formatCurrency(project.transactionAmount)}{" "}
                            {project.transactionCurrency || ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Summary */}
                  <>
                    {isSummariesEnabled ? (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                        <div className="fle items-center mb-4">
                          <h4 className="font-semibold text-blue-700">
                            AI Summary
                          </h4>
                          <div className="ml-2 flex">
                            <Sparkle className="h-3.5 w-3.5 text-yellow-500" />
                            <Sparkle className="h-3.5 w-3.5 text-yellow-400 -ml-1" />
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-100">
                          <p className="text-sm whitespace-pre-lineleading-relaxed text-gray-700">
                            {project.projectSummary}
                          </p>
                        </div>
                        <div className="ml-3 text-xs tet-blue-600 italic flex items-center">
                          <Lightbulb className="h-3w-3 mr-1" />
                          <span>
                            AI-generated summary based on the project data.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 bg-gray-100 p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="fle items-center">
                            <h4 className="font-semibold text-blue-700">
                              Project Summary
                            </h4>
                            <div>
                              <Sparkle className="h-3.5 w-3.5 text-gray-500" />
                              <Sparkle className="h-3.5 w-3.5 text-gray-400 -ml-1" />
                            </div>
                          </div>
                          <Lock className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                          <Link
                            href={`/manage-plan`}
                            className="text-center py-4"
                          >
                            <Lock className="h-4 w-4 m-auto mb-3" />
                            <p className="text-sm tet-gray-500 mb-2">
                              AI Project Summary is a PRO level feature
                            </p>
                            <button className="mt-2 px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 inline-block">
                              Upgrade to Unlock
                            </button>
                          </Link>
                        </div>
                        <div className="mt-3 tet-xs text-gray-400 italic flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          <span>Get AI-powered insightsfrom your projects</span>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}

            {/* Itemizing*/}

            {/* End Extracted Data Section*/}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(size: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let index = 0;
  let formattedSize = size;

  while (formattedSize >= 1024 && index < units.length - 1) {
    formattedSize /= 1024;
    index++;
  }

  return `${formattedSize.toFixed(2)} ${units[index]}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(date: Date): string {
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Return a fallback value for invalid dates
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
