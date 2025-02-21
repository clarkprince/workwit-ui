"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      router.push(`/activate?code=${code}`);
    } else {
      router.push("/activities");
    }
  }, [code, router]);

  return null;
}
