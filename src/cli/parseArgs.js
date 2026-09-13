export function parseArgs(args) {
  const allowedArgs = ["--city", "--days", "--no-cache"];
  for (const arg of args) {
    if (arg.startsWith("--") && !allowedArgs.includes(arg)) {
      throw new Error(`Invalid argument: ${arg}`);
    }
  }
  const cityIndex = args.indexOf("--city");
  const daysIndex = args.indexOf("--days");

  if (cityIndex == -1 || args[cityIndex + 1] === undefined) {
    throw new Error("Invalid argument. Please use --city <city_name>");
  }

  const cities = args[cityIndex + 1]
    .split(",")
    .map((city) => city.trim())
    .filter((city) => city.length > 0);

  if (cities.length === 0) {
    throw new Error("Invalid argument: city name cannot be empty");
  }
  const result = {
    cities,
    days: 3,
    noCache: args.includes("--no-cache"),
  };

  if (daysIndex !== -1) {
    if (args[daysIndex + 1] === undefined) {
      throw new Error("Invalid argument: --days requires a value");
    }
    const days = Number(args[daysIndex + 1]);
    if (!Number.isInteger(days) || days < 1 || days > 7) {
      throw new Error(
        "Invalid argument: --days must be an integer from 1 to 7",
      );
    }
    result.days = days;
  }

  return result;
}
