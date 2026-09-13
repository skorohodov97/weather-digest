import { parseArgs } from "./cli/parseArgs.js";
import { formatWeatherReport } from "./format/consoleFormatter.js";
import { getWeatherReport } from "./storage/reportStorage.js";

try {
  const { cities, days, noCache } = parseArgs(process.argv.slice(2));

  const reportPromises = cities.map((city) =>
    getWeatherReport(city, days, noCache),
  );
  const results = await Promise.allSettled(reportPromises);

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log(formatWeatherReport(result.value));
    } else {
      console.error(result.reason.message);
    }
  }

  if (results.some((result) => result.status === "rejected")) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
