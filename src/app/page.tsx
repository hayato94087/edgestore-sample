import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
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
