/**
 * Import the catalogue workbook into the typed data files.
 *
 * The workbook is the source of truth for the first load. Existing data files
 * are never overwritten: hand edits win. Re-run the script to check the
 * generated output against the committed files; it only writes when a file is
 * absent.
 *
 * Usage: npm run import-products
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import * as XLSX from "xlsx";

import { AREAS, type AreaSlug } from "../lib/areas";
import {
  validateProducts,
  type PhotoStatus,
  type Product,
} from "../lib/schemas/product";

const WORKBOOK = path.join(
  process.cwd(),
  "docs",
  "KGICL_Product_Catalogue_Consolidated.xlsx",
);
const GENERATED_COMMENT =
  "// Generated from docs/KGICL_Product_Catalogue_Consolidated.xlsx. Safe to edit by hand.";

const EXPECTED_COUNTS: Record<AreaSlug, number> = {
  "solar-lighting": 17,
  "cctv-security": 7,
  "electrical-supplies": 15,
  "industrial-supply": 24,
};
const EXPECTED_TOTAL = 63;

const AREA_FROM_PILLAR: Record<string, AreaSlug> = {
  "Solar Lighting": "solar-lighting",
  "CCTV & Security": "cctv-security",
  "Electrical Supplies": "electrical-supplies",
  "Industrial Supply": "industrial-supply",
};

const GROUP_KEYS: Record<string, string> = {
  "Street Lights": "street-lights",
  Cameras: "cameras",
  "Camera + Lighting": "camera-lighting",
  "Recorders & Accessories": "recorders-accessories",
  "Cables & Wiring": "cables-wiring",
  "Switches, Sockets & Conduit": "switches-sockets-conduit",
  "Distribution & Protection": "distribution-protection",
  "Power Backup & Protection": "power-backup-protection",
  "Lighting & Fans": "lighting-fans",
  "PPE & Safety": "ppe-safety",
  "Earthing & Lightning Protection": "earthing-lightning-protection",
  "Pipes & Marine": "pipes-marine",
};

const EXPECTED_HEADERS = [
  "ID",
  "Pillar",
  "Group",
  "Proposed name (draft)",
  "Name status",
  "Slug (draft)",
  "Slug status",
  "Model code",
  "Name as received",
  "Details as received",
  "Details status",
  "Standard / material (as received)",
  "Size table likely",
  "Photo status",
  "Cloudinary public ID",
  "Photo URL (as received)",
  "Featured (order)",
  "Claims status",
  "Source",
  "Notes",
];

type WorkbookRow = Record<string, string>;

function text(row: WorkbookRow, column: string): string {
  return String(row[column] ?? "").trim();
}

function fail(message: string): never {
  console.error(`Import stopped: ${message}`);
  process.exit(1);
}

function mapArea(pillar: string, row: WorkbookRow): AreaSlug {
  const area = AREA_FROM_PILLAR[pillar];
  if (!area) fail(`unknown Pillar "${pillar}" on product ${text(row, "ID")}.`);
  return area;
}

function mapGroup(group: string, area: AreaSlug, id: string): string {
  const key = GROUP_KEYS[group];
  const areaGroups = AREAS.find((entry) => entry.slug === area)?.groups ?? [];
  if (!key || !areaGroups.some((entry) => entry.key === key)) {
    fail(`group "${group}" on ${id} is not listed for the ${area} area.`);
  }
  return key;
}

function mapPhotoStatus(value: string, id: string): PhotoStatus {
  if (value.startsWith("Real")) return "real";
  if (value.startsWith("Missing")) return "missing";
  if (value.startsWith("Stock")) return "stock";
  if (value.startsWith("Link present")) return "unverified";
  fail(`unrecognised Photo status "${value}" on ${id}.`);
}

function cutAtBoundary(value: string, maxLength = 110): string {
  if (value.length <= maxLength) return value;

  const slice = value.slice(0, maxLength);
  const comma = slice.lastIndexOf(",");
  const space = slice.lastIndexOf(" ");
  const cut = Math.max(comma, space);

  return (cut > 0 ? slice.slice(0, cut) : slice).trimEnd();
}

function parseSolarSpecs(details: string, id: string): Product["specs"] {
  return details.split(" | ").map((part) => {
    const separator = part.indexOf(": ");
    if (separator === -1) {
      fail(`solar detail "${part}" on ${id} is not in "Label: value" form.`);
    }
    return {
      label: part.slice(0, separator).trim(),
      value: part.slice(separator + 2).trim(),
    };
  });
}

function specValue(specs: Product["specs"], label: string): string {
  return specs.find((spec) => spec.label === label)?.value ?? "";
}

function buildProduct(row: WorkbookRow): Product {
  const id = text(row, "ID");
  const pillar = text(row, "Pillar");
  const area = mapArea(pillar, row);
  const group = mapGroup(text(row, "Group"), area, id);
  const name = text(row, "Proposed name (draft)");
  const modelCode = text(row, "Model code");
  const details = text(row, "Details as received");
  const standard = text(row, "Standard / material (as received)");
  const publicId = text(row, "Cloudinary public ID");
  const claimsStatus = text(row, "Claims status");
  const isSolar = area === "solar-lighting";

  const specs = isSolar
    ? parseSolarSpecs(details, id)
    : [
        { label: "Details", value: details },
        ...(standard ? [{ label: "Standard / material", value: standard }] : []),
      ];

  const wattageMatch = name.match(/^(\d+)W/);
  if (isSolar && !wattageMatch) {
    fail(`solar product ${id} has no wattage at the start of its name.`);
  }
  const wattage = wattageMatch ? Number(wattageMatch[1]) : undefined;

  const summary = isSolar
    ? `${wattage}W solar street light, ${specValue(specs, "Type")}. ${specValue(specs, "Backup")} backup.`
    : cutAtBoundary(details || name);

  const product: Product = {
    id,
    slug: text(row, "Slug (draft)"),
    name,
    ...(modelCode ? { modelCode } : {}),
    area,
    group,
    summary,
    specs,
    ...(wattage !== undefined ? { wattage } : {}),
    ...(isSolar ? { warranty: "1 year" } : {}),
    claimsVerified: claimsStatus === "n/a",
    familyLikely: text(row, "Size table likely") === "Likely",
    image: {
      publicId: publicId || null,
      alt: modelCode ? `${name}, ${modelCode}` : name,
      status: mapPhotoStatus(text(row, "Photo status"), id),
    },
    published: true,
    review: {
      nameStatus: text(row, "Name status"),
      detailsStatus: text(row, "Details status"),
      claimsStatus,
      photoStatus: text(row, "Photo status"),
      notes: text(row, "Notes"),
    },
  };

  return product;
}

/** Format a value as readable TypeScript, omitting undefined object keys. */
function formatValue(value: unknown, depth = 0): string {
  const pad = "  ".repeat(depth);
  const innerPad = "  ".repeat(depth + 1);

  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value
      .map((entry) => `${innerPad}${formatValue(entry, depth + 1)}`)
      .join(",\n")}\n${pad}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, entry]) => entry !== undefined,
    );
    if (entries.length === 0) return "{}";
    return `{\n${entries
      .map(([key, entry]) => {
        const safeKey = /^[A-Za-z_$][\w$]*$/.test(key)
          ? key
          : JSON.stringify(key);
        return `${innerPad}${safeKey}: ${formatValue(entry, depth + 1)}`;
      })
      .join(",\n")}\n${pad}}`;
  }

  throw new Error(`Cannot format value of type ${typeof value}.`);
}

function dataFile(products: Product[]): string {
  return `${GENERATED_COMMENT}\n\nimport type { Product } from "@/lib/schemas/product";\n\nexport const products: Product[] = ${formatValue(products)};\n`;
}

function diffSummary(existing: string, generated: string): string {
  const existingLines = existing.split(/\r?\n/);
  const generatedLines = generated.split(/\r?\n/);
  const max = Math.max(existingLines.length, generatedLines.length);
  const lines: string[] = [];
  let differences = 0;

  for (let index = 0; index < max; index += 1) {
    if (existingLines[index] !== generatedLines[index]) {
      differences += 1;
      if (lines.length < 6) {
        lines.push(
          `  line ${index + 1}: existing ${JSON.stringify(existingLines[index] ?? "")} / generated ${JSON.stringify(generatedLines[index] ?? "")}`,
        );
      }
    }
  }

  return `${differences} differing line${differences === 1 ? "" : "s"}${
    lines.length ? `\n${lines.join("\n")}` : ""
  }`;
}

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function printSummary(products: Product[]): void {
  console.log("\nImport summary");
  console.log("--------------");

  for (const area of AREAS) {
    const areaProducts = products.filter((product) => product.area === area.slug);
    console.log(`\n${area.title} (${area.slug}): ${areaProducts.length}`);
    for (const group of area.groups) {
      const count = areaProducts.filter(
        (product) => product.group === group.key,
      ).length;
      console.log(`  ${group.label}: ${count}`);
    }
  }

  const photoCounts = countBy(products.map((product) => product.image.status));
  const claimsCounts = countBy(
    products.map((product) =>
      product.claimsVerified ? "verified (n/a)" : "not verified",
    ),
  );

  console.log(`\nTotal: ${products.length} (expected ${EXPECTED_TOTAL})`);
  console.log(
    `Photo status: ${["real", "stock", "unverified", "missing"]
      .map((status) => `${status} ${photoCounts[status] ?? 0}`)
      .join(", ")}`,
  );
  console.log(
    `Claims status: ${Object.entries(claimsCounts)
      .map(([status, count]) => `${status} ${count}`)
      .join(", ")}`,
  );
}

function main(): void {
  if (process.argv.includes("--force")) {
    fail(
      "this importer never overwrites existing files; --force is not supported.",
    );
  }

  if (!existsSync(WORKBOOK)) {
    fail(`workbook not found at ${path.relative(process.cwd(), WORKBOOK)}.`);
  }

  const workbook = XLSX.readFile(WORKBOOK);
  const sheet = workbook.Sheets.Products;
  if (!sheet) fail('the workbook has no "Products" sheet.');

  const rows = XLSX.utils.sheet_to_json<WorkbookRow>(sheet, {
    defval: "",
    raw: false,
  });

  if (rows.length === 0) fail("the Products sheet is empty.");

  const headers = Object.keys(rows[0]);
  const missingHeaders = EXPECTED_HEADERS.filter(
    (header) => !headers.includes(header),
  );
  if (missingHeaders.length > 0) {
    fail(`missing workbook columns: ${missingHeaders.join(", ")}.`);
  }

  const products = rows.map(buildProduct);

  for (const area of AREAS) {
    const count = products.filter((product) => product.area === area.slug).length;
    if (count !== EXPECTED_COUNTS[area.slug]) {
      fail(
        `${area.title} has ${count} products; expected ${EXPECTED_COUNTS[area.slug]}. ` +
          "Check the workbook before continuing.",
      );
    }
  }
  if (products.length !== EXPECTED_TOTAL) {
    fail(
      `the workbook produced ${products.length} products; expected ${EXPECTED_TOTAL}. ` +
        "Check the workbook before continuing.",
    );
  }

  validateProducts(products);
  printSummary(products);

  const outputs = AREAS.map((area) => {
    const areaProducts = products.filter(
      (product) => product.area === area.slug,
    );
    return {
      area,
      absolutePath: path.join(process.cwd(), area.dataFile),
      relativePath: area.dataFile,
      content: dataFile(areaProducts),
    };
  });

  const blocked: string[] = [];

  for (const output of outputs) {
    if (!existsSync(output.absolutePath)) continue;
    const existing = readFileSync(output.absolutePath, "utf8");
    if (existing === output.content) {
      console.log(`\n${output.relativePath}: no changes.`);
    } else {
      blocked.push(
        `${output.relativePath}: ${diffSummary(existing, output.content)}`,
      );
    }
  }

  if (blocked.length > 0) {
    console.error(
      "\nExisting files differ from the workbook. Nothing was written because " +
        "hand edits must not be overwritten.\n" +
        blocked.join("\n\n") +
        "\n\nReview the differences and edit the data files by hand, or delete a " +
        "file to regenerate it from the workbook.",
    );
    process.exit(1);
  }

  const created: string[] = [];
  for (const output of outputs) {
    if (existsSync(output.absolutePath)) continue;
    mkdirSync(path.dirname(output.absolutePath), { recursive: true });
    writeFileSync(output.absolutePath, output.content, "utf8");
    created.push(output.relativePath);
  }

  if (created.length === 0) {
    console.log("\nNothing to write. The data files already match the workbook.");
  } else {
    console.log(`\nWrote ${created.length} data file(s):`);
    for (const file of created) console.log(`  ${file}`);
  }
}

main();
