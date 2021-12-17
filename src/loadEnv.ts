/**
 * changed from https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts
 *
 */

import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
export function lookupFile(dir: string, formats: string[], pathOnly = false): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : fs.readFileSync(fullPath, "utf-8");
    }
  }
  const parentDir = path.dirname(dir);
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly);
  }
}
export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target];
}

export function allowEnv(env: Record<string, string>, key: string, prefixes: Array<string>) {
  if (
    !prefixes ||
    prefixes.length === 0 ||
    (prefixes.some((prefix) => key.startsWith(prefix)) && env[key] === undefined)
  )
    return true;
  return false;
}

export default function loadEnv(
  mode: string,
  envDir: string = process.cwd(),
  prefixes: string | string[] = []
): Record<string, string> {
  prefixes = arraify(prefixes);
  const env: Record<string, string> = {};
  const envFiles = [
    /** mode file */ `.env.${mode}`,
    /** default file */ `.env`,
  ];

  // check if there are actual env variables starting with VITE_*
  // these are typically provided inline and should be prioritized
  // for (const key in process.env) {
  //   if (allowEnv(env, key, prefixes)) {
  //     env[key] = process.env[key] as string;
  //   }
  // }

  for (const file of envFiles) {
    const path = lookupFile(envDir, [file], true);
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path), {
        debug: !!process.env.DEBUG || undefined,
      });

      // let environment variables use each other
      dotenvExpand({
        parsed,
        // prevent process.env mutation
        ignoreProcessEnv: true,
      } as any);

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (allowEnv(env, key, prefixes)) {
          env[key] = value;
        }
      }
    }
  }
  return env;
}
