import path from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().trim().min(1).max(120),
  contentType: z.string().regex(/^[\w.-]+\/[\w.+-]+$/).max(100),
});

function safeFilename(filename) {
  const basename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "-");
  return basename || "upload";
}

export function createFileController({ s3Service }) {
  return {
    async createUploadUrl(request, response) {
      const input = uploadSchema.safeParse(request.body);
      if (!input.success) return response.status(400).json({ error: "Invalid upload metadata", details: input.error.flatten() });

      const key = `users/${request.auth.sub}/${randomUUID()}-${safeFilename(input.data.filename)}`;
      const uploadUrl = await s3Service.createUploadUrl({ key, contentType: input.data.contentType });
      return response.status(201).json({ key, uploadUrl, expiresIn: 300 });
    },

    async listFiles(request, response) {
      const files = await s3Service.listUserFiles(request.auth.sub);
      return response.json({ files });
    },
  };
}
