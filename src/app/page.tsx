"use client";
import { useEdgeStore } from "@/lib/edgestore";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { edgestore, reset } = useEdgeStore();

  useEffect(() => {
    reset();
  }, []);

  return (
    <main>
      <div className="flex flex-col">
        <h1>テストページ</h1>
        <Link href="/protected-file-sample">protected-file-sample</Link>
        <Link href="/public-file-sample">public-file-sample</Link>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  );
}
