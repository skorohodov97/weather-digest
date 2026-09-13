import { parseArgs } from "./cli/parseArgs.js";

try {
  const args = parseArgs(process.argv);
  console.log(args);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
