import logger from "../utils/logger";
import { loadRegistry } from "../utils/registry";
import add from "../commands/add";

interface InstallOptions {
  overwrite?: boolean;
  yes?: boolean;
  iconLibrary?: string;
}

async function install(options: InstallOptions): Promise<void> {
  const registry = await loadRegistry();
  // Icon adapters are never blanket-installed: `icons/<lib>` entries exist only
  // to serve `--icon-library` (ui/components.md contract).
  const names = Object.keys(registry).filter((name) => !name.startsWith("icons/"));
  logger.step(`Installing all ${names.length} entries from registry...`);
  await add(names, options);
}

export default install;
