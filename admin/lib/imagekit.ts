const uploadEndpoint = "https://upload.imagekit.io/api/v1/files/upload";

function credentials() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/$/, "");
  if (!privateKey || !urlEndpoint)
    throw new Error("ImageKit is not configured on the server.");
  return { privateKey, urlEndpoint };
}

export async function uploadImageKit(
  data: Buffer,
  fileName: string,
  folder: string,
  tags = "bg-elevators",
) {
  const { privateKey, urlEndpoint } = credentials();
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array(data)], { type: "image/webp" }));
  form.set("fileName", fileName.replace(/[^a-zA-Z0-9._-]/g, "-"));
  form.set("folder", `/bg-elevators/${folder}`);
  form.set("useUniqueFileName", "true");
  form.set("tags", tags);

  const response = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
    },
    body: form,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result?.message || "ImageKit upload failed.");

  const url = String(result.url || "");
  if (!url.startsWith(`${urlEndpoint}/`) && !url.startsWith("https://ik.imagekit.io/"))
    throw new Error("ImageKit returned an unexpected image URL.");
  return url;
}

export const uploadConfiguratorImage = (
  data: Buffer,
  fileName: string,
  folder: string,
) => uploadImageKit(
  data,
  fileName,
  `configurator/${folder}`,
  "bg-elevators,configurator,cms-upload",
);
