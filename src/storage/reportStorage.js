import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getWeatherForCity } from "../services/weatherService.js";

const REPORTS_DIRECTORY = process.env.REPORTS_DIRECTORY ?? "reports";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getSafeCityName(city) {
  return city.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
}

function getReportPath(city) {
  const fileName = `${getSafeCityName(city)}-${getTodayDate()}.json`;

  return path.join(REPORTS_DIRECTORY, fileName);
}

async function readCachedReport(city) {
  try {
    const fileContent = await readFile(getReportPath(city), "utf8");

    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function hasRequestedDays(report, days) {
  return report?.forecast?.daily?.time?.length === days;
}

async function saveReport(city, report) {
  await mkdir(REPORTS_DIRECTORY, { recursive: true });
  await writeFile(getReportPath(city), JSON.stringify(report, null, 2), "utf8");
}

export async function getWeatherReport(city, days, noCache = false) {
  if (!noCache) {
    const cachedReport = await readCachedReport(city);

    if (hasRequestedDays(cachedReport, days)) {
      return cachedReport;
    }
  }

  const report = await getWeatherForCity(city, days);
  await saveReport(city, report);

  return report;
}
