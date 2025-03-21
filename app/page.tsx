"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./contexts/auth-context";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      router.push(`/activate?code=${code}`);
    } else if (user) {
      const defaultPath = user.role === "1" ? "/parts" : "/activities";
      router.push(defaultPath);
    } else {
      router.push("/login");
    }
  }, [code, router, user]);

  return null;
}
