import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const cwd = fileURLToPath(new URL("../", import.meta.url));
const backend = spawn(
  process.execPath,
  ["--env-file-if-exists=.env", "server/index.js"],
  { cwd, stdio: "inherit" },
);
const frontend = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "0.0.0.0",
    ...process.argv.slice(2),
  ],
  { cwd, stdio: "inherit" },
);
function stop() {
  backend.kill();
  frontend.kill();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
backend.on("exit", (code) => {
  if (code) {
    frontend.kill();
    process.exitCode = code;
  }
});
frontend.on("exit", (code) => {
  backend.kill();
  process.exitCode = code || 0;
});
