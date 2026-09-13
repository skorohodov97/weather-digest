export function parseArgs(args) {
  const result = {
    cities: [],
    days: 3,
    noCache: false,
  };
  let hasCity = false;
  let hasDays = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--city") {
      if (hasCity) {
        throw new Error("Invalid argument: --city can be used only once");
      }

      const cityNames = args[index + 1];
      if (cityNames === undefined || cityNames.startsWith("--")) {
        throw new Error("Invalid argument. Please use --city <city_name>");
      }

      result.cities = cityNames
        .split(",")
        .map((city) => city.trim())
        .filter((city) => city.length > 0);

      if (result.cities.length === 0) {
        throw new Error("Invalid argument: city name cannot be empty");
      }

      hasCity = true;
      index += 1;
      continue;
    }

    if (arg === "--days") {
      if (hasDays) {
        throw new Error("Invalid argument: --days can be used only once");
      }

      const daysValue = args[index + 1];
      const days = Number(daysValue);
      if (
        daysValue === undefined ||
        daysValue.startsWith("--") ||
        !Number.isInteger(days) ||
        days < 1 ||
        days > 7
      ) {
        throw new Error(
          "Invalid argument: --days must be an integer from 1 to 7",
        );
      }

      result.days = days;
      hasDays = true;
      index += 1;
      continue;
    }

    if (arg === "--no-cache") {
      if (result.noCache) {
        throw new Error("Invalid argument: --no-cache can be used only once");
      }

      result.noCache = true;
      continue;
    }

    throw new Error(`Invalid argument: ${arg}`);
  }

  if (!hasCity) {
    throw new Error("Invalid argument. Please use --city <city_name>");
  }

  return result;
}
