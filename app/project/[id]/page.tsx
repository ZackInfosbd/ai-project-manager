"use client";

import { useParams } from "next/navigation";

export default function Project() {
  const params = useParams<{ id: string }>();

  return <div>Project: {params.id} </div>;
}
