"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div className="w-full min-h-screen bg-[var(--background)]">
      <div className={isAnimating ? "page-enter-active" : "page-enter"}>{children}</div>
    </div>
  );
}
