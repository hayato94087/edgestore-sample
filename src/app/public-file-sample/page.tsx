"use client";

import { useState } from "react";
import { useEdgeStore } from "../../lib/edgestore";

export default function Home() {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();

  return (
    <main>
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <button
          onClick={async () => {
            if (file) {
              const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                  // you can use this to show a progress bar
                  console.log(progress);
                },
              });
              // you can run some server action or api here
              // to add the necessary data to your database
              console.log(res);
            }
          }}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Upload
        </button>
      </div>
    </main>
  );
}
