import { parseArgs } from "./cli/parseArgs.js";
import { getWeatherForCities } from "./services/weatherService.js";

try {
  const { cities, days } = parseArgs(process.argv.slice(2));

  const results = await getWeatherForCities(cities, days);

  console.dir(results, { depth: null });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
