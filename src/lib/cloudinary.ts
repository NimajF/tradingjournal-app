import { createHash } from "node:crypto";

const BASE_URL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image`;

export async function uploadImage(
  file: File,
): Promise<{ url: string; public_id: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(`${BASE_URL}/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.statusText}`);

  const data = await res.json();
  return { url: data.secure_url, public_id: data.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHash("sha1")
    .update(
      `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`,
    )
    .digest("hex");

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("timestamp", timestamp);
  form.append("api_key", process.env.CLOUDINARY_API_KEY!);
  form.append("signature", signature);

  const res = await fetch(`${BASE_URL}/destroy`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Cloudinary delete failed: ${res.statusText}`);
}
