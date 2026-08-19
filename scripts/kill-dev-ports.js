const { execSync } = require("child_process");

const ports = [3000, 3001];

for (const port of ports) {
  try {
    execSync(`npx --yes kill-port ${port}`, { stdio: "ignore", windowsHide: true });
  } catch {
    // Port was not in use — safe to ignore
  }
}
