"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { QueueDisplayBoard } from "@/features/queue-display/QueueDisplayBoard";

/**
 * OPD waiting-room wall screen (#190).
 *
 * Deliberately unauthenticated — see `isPublicPath` in lib/auth/routes.ts and
 * the matching decision on the backend's SSE endpoint. It also renders outside
 * the app chrome: no sidebar, no navbar, no "signed in as". A corridor TV has
 * no user.
 *
 * Department comes from the query string so the same URL can be pinned to a
 * different screen per floor without a build.
 */
function QueueDisplayPage() {
  const params = useSearchParams();
  const departmentId = params.get("department");

  return <QueueDisplayBoard departmentId={departmentId} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QueueDisplayPage />
    </Suspense>
  );
}
