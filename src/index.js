import { parseArgs } from "./cli/parseArgs.js";
import { getWeatherForCities } from "./services/weatherService.js";

try {
  const { cities, days } = parseArgs(process.argv.slice(2));

  const results = await getWeatherForCities(cities, days);

  for (const result of results) {
    if (result.status === "fulfilled") {
      console.dir(result.value, { depth: null });
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
