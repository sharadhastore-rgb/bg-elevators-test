import mongoose from "mongoose";
import sharp from "sharp";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
const blogs = mongoose.connection.collection("blogs");
try {
  const posts = await blogs.find(
    { "cover.data": { $exists: true }, "cover.thumbnailData": { $exists: false } },
    { projection: { "cover.data": 1 } },
  ).toArray();
  let updated = 0;
  let totalBytes = 0;
  for (const post of posts) {
    const source = post.cover.data.buffer || post.cover.data;
    const thumbnail = await sharp(Buffer.from(source))
      .resize(160, 100, { fit: "cover", position: "centre" })
      .webp({ quality: 72 })
      .toBuffer();
    await blogs.updateOne(
      { _id: post._id },
      { $set: { "cover.thumbnailData": thumbnail, "cover.thumbnailContentType": "image/webp" } },
    );
    updated += 1;
    totalBytes += thumbnail.length;
  }
  console.log(`Generated ${updated} thumbnails (${Math.round(totalBytes / 1024)} KB total).`);
} finally {
  await mongoose.disconnect();
}
