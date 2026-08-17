"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useMockSession } from "@/lib/session/mockSession";

export default function HomePage() {
  const router = useRouter();
  const { homeHref } = useMockSession();

  useEffect(() => {
    router.replace(homeHref);
  }, [homeHref, router]);

  return null;
}
