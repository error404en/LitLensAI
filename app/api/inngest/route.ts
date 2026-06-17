export const dynamic = "force-dynamic";
import { serve } from "inngest/next";
import { inngest } from "@/lib/ai/pipeline/inngest.client";
import { processPaper } from "@/lib/ai/pipeline/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processPaper,
  ],
});
