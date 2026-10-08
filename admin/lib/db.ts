import mongoose from "mongoose";
import dns from "node:dns";
const state = globalThis as typeof globalThis & {
  mongoPromise?: Promise<typeof mongoose>;
  mongoDnsConfigured?: boolean;
};

async function resolveMongoUri(uri: string, dnsServers: string[]) {
  if (!uri.toLowerCase().startsWith("mongodb+srv://")) return uri;

  const parsed = new URL(uri);
  const resolver = new dns.promises.Resolver();
  if (dnsServers.length) resolver.setServers(dnsServers);
  const [records, textRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${parsed.hostname}`),
    resolver.resolveTxt(parsed.hostname).catch(() => []),
  ]);
  if (!records.length)
    throw new Error(`No MongoDB hosts found for ${parsed.hostname}.`);

  const credentials = parsed.username
    ? `${parsed.username}:${parsed.password}@`
    : "";
  const hosts = records
    .map(({ name, port }) => `${name.replace(/\.$/, "")}:${port}`)
    .join(",");
  const params = new URLSearchParams(parsed.searchParams);
  params.set("tls", "true");
  for (const entry of textRecords.flat()) {
    for (const [key, value] of new URLSearchParams(entry)) {
      if (!params.has(key)) params.set(key, value);
    }
  }
  return `mongodb://${credentials}${hosts}${parsed.pathname}?${params}`;
}

export async function connectDb() {
  const configuredUri = process.env.MONGODB_URI?.trim()
    .replace(/^["']/, "")
    .replace(/["']?(?:SMTP_HOST|SMTP_PORT|SMTP_USER|MONGODB_DB|DNS_SERVERS)=.*/, "")
    .replace(/["']$/, "");
  if (!configuredUri) throw new Error("MONGODB_URI is not configured.");
  if (!/^mongodb(?:\+srv)?:\/\//i.test(configuredUri))
    throw new Error(
      'MONGODB_URI must start with "mongodb://" or "mongodb+srv://".',
    );
  const servers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean) || [];
  if (!state.mongoDnsConfigured) {
    if (servers?.length) dns.setServers(servers);
    state.mongoDnsConfigured = true;
  }
  if (!state.mongoPromise) {
    state.mongoPromise = resolveMongoUri(configuredUri, servers)
      .then((uri) => mongoose.connect(uri, {
        dbName: process.env.MONGODB_DB || undefined,
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: process.env.NODE_ENV === "production" ? 1 : 0,
        maxIdleTimeMS: 60_000,
        serverSelectionTimeoutMS: 5000,
        family: 4,
      }))
      .catch((error) => {
        state.mongoPromise = undefined;
        throw error;
      });
  }
  return state.mongoPromise;
}
