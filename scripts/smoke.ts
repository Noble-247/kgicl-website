/**
 * Smoke test for a deployed build.
 *
 *   npm run smoke -- https://kriss-goodnews-solar.vercel.app
 *   npm run smoke -- https://kgiclsolar.com --mode=live
 *
 * Checks every public route, the sitemap and robots.txt, plus an unknown URL.
 * Review builds must send `X-Robots-Tag: noindex`; live builds must not.
 */

const TIMEOUT_MS = 20_000;

const HTML_PATHS = [
  "/",
  "/solar-lighting",
  "/cctv-security",
  "/electrical-supplies",
  "/industrial-supply",
  "/products/100w-solar-street-light-10-eye",
  "/products/indoor-dome-cctv-camera",
  "/products/ai-solar-camera-with-lighting-2-in-1",
  "/products/pvc-single-core-copper-wire",
  "/products/pure-copper-earth-rod-solid",
  "/services",
  "/projects",
  "/about",
  "/contact",
  "/privacy",
] as const;

const FILE_PATHS = ["/sitemap.xml", "/robots.txt"] as const;
const UNKNOWN_PATH = "/this-page-does-not-exist-kgicl";
const LAUNCH_PLACEHOLDER = /launching soon/i;

type Mode = "review" | "live";

type Row = {
  path: string;
  status: string;
  title: string;
  launchText: string;
  robotsHeader: string;
  ok: boolean;
};

function fail(message: string): never {
  console.error(`smoke: ${message}`);
  process.exit(1);
}

function parseArgs(argv: string[]): { baseUrl: string; mode: Mode } {
  let baseUrl = "";
  let mode: Mode | null = null;

  for (const arg of argv) {
    if (arg.startsWith("--mode=")) {
      const value = arg.slice("--mode=".length);
      if (value !== "review" && value !== "live") {
        fail(`--mode must be "review" or "live", received "${value}"`);
      }
      mode = value;
      continue;
    }
    if (arg.startsWith("--")) fail(`unknown option "${arg}"`);
    if (baseUrl) fail("pass exactly one base URL");
    baseUrl = arg;
  }

  if (!baseUrl) {
    fail("usage: npm run smoke -- <base-url> [--mode=review|live]");
  }

  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    fail(`"${baseUrl}" is not a valid URL`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    fail("base URL must start with http:// or https://");
  }

  const host = parsed.hostname.toLowerCase();
  const inferred: Mode =
    host === "kgiclsolar.com" || host === "www.kgiclsolar.com"
      ? "live"
      : "review";

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    mode: mode ?? inferred,
  };
}

function readTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return "";
  return match[1]
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function check(
  baseUrl: string,
  mode: Mode,
  path: string,
  expectStatus: number,
): Promise<{ row: Row; title: string }> {
  const url = `${baseUrl}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "kgicl-smoke-test" },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      row: {
        path,
        status: `ERROR ${reason}`,
        title: "-",
        launchText: "-",
        robotsHeader: "-",
        ok: false,
      },
      title: "",
    };
  }

  const body = await response.text();
  const isHtml = response.headers
    .get("content-type")
    ?.toLowerCase()
    .includes("text/html");
  const title = isHtml ? readTitle(body) : "";
  const hasLaunchText = isHtml && LAUNCH_PLACEHOLDER.test(body);
  const robotsTag = response.headers.get("x-robots-tag") ?? "";
  const expectsNoindex = mode === "review";
  const hasNoindex = /noindex/i.test(robotsTag);

  const statusOk = response.status === expectStatus;
  const titleOk = isHtml ? title.length > 0 : true;
  const robotOk = expectsNoindex ? hasNoindex : !hasNoindex;

  return {
    row: {
      path,
      status: String(response.status),
      title: isHtml ? (title || "MISSING") : "-",
      launchText: isHtml ? (hasLaunchText ? "FOUND" : "none") : "-",
      robotsHeader: robotsTag || "absent",
      ok: statusOk && titleOk && !hasLaunchText && robotOk,
    },
    title,
  };
}

function pad(value: string, width: number): string {
  const text = value.length > width ? `${value.slice(0, width - 3)}...` : value;
  if (text.length >= width) return text;
  return text + " ".repeat(width - text.length);
}

async function main(): Promise<void> {
  const { baseUrl, mode } = parseArgs(process.argv.slice(2));

  console.log(`Smoke test: ${baseUrl} (${mode} mode)\n`);

  const rows: Row[] = [];
  const titles = new Map<string, string>();

  for (const path of HTML_PATHS) {
    const { row, title } = await check(baseUrl, mode, path, 200);
    if (title) {
      const existing = titles.get(title);
      if (existing) {
        row.title = `DUPLICATE of ${existing}`;
        row.ok = false;
      } else {
        titles.set(title, path);
      }
    }
    rows.push(row);
  }

  for (const path of FILE_PATHS) {
    rows.push((await check(baseUrl, mode, path, 200)).row);
  }

  const unknown = await check(baseUrl, mode, UNKNOWN_PATH, 404);
  unknown.row.title = "-";
  unknown.row.launchText = "-";
  unknown.row.ok =
    unknown.row.ok &&
    unknown.row.status === "404" &&
    !/MISSING|DUPLICATE/.test(unknown.row.title);
  rows.push(unknown.row);

  const pathWidth = Math.max(...rows.map((row) => row.path.length));
  const statusWidth = Math.max(6, ...rows.map((row) => row.status.length));

  console.log(
    `${pad("PATH", pathWidth)}  ${pad("STATUS", statusWidth)}  ${pad(
      "TITLE",
      36,
    )}  ${pad("LAUNCH", 8)}  RESULT`,
  );
  for (const row of rows) {
    console.log(
      `${pad(row.path, pathWidth)}  ${pad(row.status, statusWidth)}  ${pad(
        row.title,
        36,
      )}  ${pad(row.launchText, 8)}  ${row.ok ? "PASS" : "FAIL"}`,
    );
  }

  const failures = rows.filter((row) => !row.ok);
  console.log(
    `\n${rows.length - failures.length}/${rows.length} checks passed; ` +
      `${failures.length} failed.`,
  );

  process.exitCode = failures.length > 0 ? 1 : 0;
}

void main();
