import logger from "../utils/logger";
import { loadRegistry } from "../utils/registry";
import add from "../commands/add";

interface InstallOptions {
  overwrite?: boolean;
  yes?: boolean;
}

async function install(options: InstallOptions): Promise<void> {
  const registry = await loadRegistry();
  const names = Object.keys(registry);
  logger.step(`Installing all ${names.length} entries from registry...`);
  await add(names, options);
}

export default install;
