import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[50vh] w-screen flex-col items-center justify-center">
      <LoaderCircle className="size-10 animate-[spin_0.4s_linear_infinite]" />
    </div>
  );
}
