"use client";

import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

function UserSync() {
  const { user, isSignedIn, isLoaded } = useUser();
  const hasSynced = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (user?.id !== lastUserId.current) {
      lastUserId.current = user?.id ?? null;
      hasSynced.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    const handleUserSync = async () => {
      if (!isLoaded || !isSignedIn || !user || hasSynced.current) return;
      hasSynced.current = true;
      try {
        await syncUser();
        // Reload user so Clerk refetches org memberships - avoids needing a page refresh
        await user.reload();
      } catch (error) {
        console.log("Failed to sync user", error);
        hasSynced.current = false;
      }
    };

    handleUserSync();
  }, [isLoaded, isSignedIn, user]);

  return null;
}

export default UserSync;
