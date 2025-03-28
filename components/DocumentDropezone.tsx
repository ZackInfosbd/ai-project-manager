"use client";

import { uploadPDF } from "@/actions/uploadPDF";
import { useUser } from "@clerk/nextjs";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { AlertCircle, CheckCircle, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Button } from "./ui/button";

const DocumentDropezone = () => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const user = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    value: isFeatureEnabled,
    featureUsageExceeded,
    featureAllocation,
    featureUsage,
  } = useSchematicEntitlement("scanning");

  //   console.log("isFeatureEnabled", isFeatureEnabled);
  //   console.log("isFeatureUsage", featureUsage);
  //   console.log("featureUsageExceeded", featureUsageExceeded);
  //   console.log("featureAllocation", featureAllocation);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
    },
    [],
  );

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      console.log("Log files from handleUpload", files);

      if (!user) {
        alert("Please sign in to upload files");
        return;
      }

      const file = files[0];

      if (!file) {
        alert("Please select a file to upload");
        return;
      }

      const fileArray = Array.from(files);
      const pdfFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLocaleLowerCase().endsWith(".pdf"),
      );

      if (pdfFiles.length === 0) {
        alert("Please Drop only pdf files");
        return;
      }

      setIsUploading(true);

      try {
        const newUploadedFiles: string[] = [];

        for (const file of pdfFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);

          const result = await uploadPDF(formData);

          if (!result) {
            throw new Error("Upload failed - no response received");
          }

          if (!result.success) {
            throw new Error(result.error);
          }

          newUploadedFiles.push(file.name);
        }

        setIsUploading(false);
        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

        setTimeout(() => {
          setUploadedFiles([]);
        }, 5000);

        router.push("/projects");
      } catch (error) {
        console.log("Upload failed", error);

        alert(
          `Upload failed ${error instanceof Error ? error.message : "unknown error"}`,
        );
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
      console.log("Dropped!!!");

      if (!user) {
        alert("Please sign in to upload files");
        return;
      }

      if (featureUsageExceeded) {
        alert("You have exceeded your feature allocation");
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleUpload(e.target.files);
      }
    },
    [handleUpload],
  );

  return (
    <DndContext sensors={sensors}>
      <div className=" w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingOver ? "border-blue-500 bg-blue-50" : "bg-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center ">
              <div className="w-10 h-10 border-t-2 border-b-2  border-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-600">Uploading...</p>
            </div>
          ) : !isUserSignedIn ? (
            <>
              <CloudUpload className="h-12 w-12 text-gray-600" />
              <p className="mt-2 text-sm text-gray-400">
                Please sign in to upload files
              </p>
            </>
          ) : (
            <>
              <CloudUpload className="h-12 w-12 text-gray-600" />
              <p className="mt-2 text-sm text-gray-400">
                Drag and drop your pdf files here, or click to select files
              </p>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf, .pdf"
                className="hidden"
                multiple
                onChange={handleFileInputChange}
              />
              <Button
                className="mt-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFeatureEnabled}
                onClick={triggerFileInput}
              >
                {isFeatureEnabled ? "Select files" : "Upgrade to upload"}
              </Button>
            </>
          )}
        </div>
        <div className="mt-4">
          {featureUsageExceeded && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm">
                You have exceeded your feature allocation. Please upgrade to a
                higher plan to continue uploading documents.
              </span>
            </div>
          )}
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Uploaded Files:</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {uploadedFiles.map((fileName, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 " />
                  {fileName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DndContext>
  );
};
export default DocumentDropezone;
