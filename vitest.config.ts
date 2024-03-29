import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./test/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [...configDefaults.exclude],
    testTimeout: 3600000,
    hookTimeout: 3600000,
    threads: false,
    reporters: ["verbose"]
  }
});
