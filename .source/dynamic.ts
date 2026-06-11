// @ts-nocheck
/// <reference types="vite/client" />
import { dynamic } from 'fumadocs-mdx/runtime/dynamic';
import * as Config from '../source.config';

const create = await dynamic<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"D:\\Documents\\code\\litefy-fuma\\source.config.ts","environment":"vite","outDir":"D:\\Documents\\code\\litefy-fuma\\.source"}, {"doc":{"passthroughs":["extractedReferences"]}});