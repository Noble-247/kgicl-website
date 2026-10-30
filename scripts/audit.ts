import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { getAllProducts } from "@/lib/catalogue";
import { formatReport, runAudit, type DataFile } from "@/lib/audit";
import { getSiteMode } from "@/lib/mode";

function readDataFiles(directory: string): DataFile[] {
  const files: DataFile[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...readDataFiles(fullPath));
      continue;
    }

    if (!entry.isFile()) continue;

    files.push({
      path: path.relative(process.cwd(), fullPath).split(path.sep).join("/"),
      content: readFileSync(fullPath, "utf8"),
    });
  }

  return files;
}

const report = runAudit({
  mode: getSiteMode(),
  products: getAllProducts(),
  dataFiles: readDataFiles(path.join(process.cwd(), "data")),
});

console.log(formatReport(report));

process.exitCode = report.failed ? 1 : 0;
