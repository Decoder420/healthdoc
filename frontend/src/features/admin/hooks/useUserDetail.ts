"use client";

import { useCallback, useEffect, useState } from "react";

import { getUser } from "../api";
import type { User } from "../types";

export function useUserDetail(userId: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setUser(null);
      return;
    }
    setLoading(true);
    try {
      setUser(await getUser(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { user, setUser, loading, refresh };
}
