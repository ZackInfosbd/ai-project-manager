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
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

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
  return (
    <DndContext sensors={sensors}>
      <div
        onDragOver={canUpload ? handleDragOver : undefined}
        onDragLeave={canUpload ? handleDragLeave : undefined}
        onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-lg text-center transition-colors ${isDraggingOver ? "border-blue-500 bg-blue-50" : "bg-gray-300"} ${!canUpload ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        Drope here...
      </div>
    </DndContext>
  );
};
export default DocumentDropezone;
