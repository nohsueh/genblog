import { getBaseUrl } from "@/lib/utils";
import { Params } from "next/dist/server/request/params";
import { permanentRedirect } from "next/navigation";

interface Props extends Params {
  language: string;
  tag: string;
}

export default async function HomePage({ params }: { params: Promise<Props> }) {
  const { language, tag } = await params;

  permanentRedirect(`${getBaseUrl()}/${language}/tag/${tag}/1`);
}
