import * as esbuild from "esbuild";
import { dtsPlugin } from "esbuild-plugin-d.ts";

const args = process.argv.splice(2);

const validArgs = ["--production", "--watch", "--help"];
const isProd = args.includes("--production");
const isWatch = args.includes("--watch");
const isHelp = args.includes("--help");

if (isHelp) {
    printHelp();
}

const invalidArgs = args.filter((arg) => !validArgs.includes(arg));
if (invalidArgs.length > 0) {
    console.error("Invalid arguments:", invalidArgs.join(", "));
    printHelp();
}

function printHelp() {
    console.log(`Usage: node script.js [options]`);
    console.log();
    console.log(`Options:`);
    console.log(`  --production  Run in production mode`);
    console.log(`  --watch       Enable watch mode`);
    console.log(`  --help        Show this help message`);
    process.exit(0);
}

/** @type {import("esbuild").BuildOptions} */
const config = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node16",
    sourcemap: !isProd,
    minify: isProd,
    treeShaking: isProd,
    external: ["vscode"],
    logLevel: "info",
    outdir: "dist",
    tsconfig: "./tsconfig.json",
    plugins: [dtsPlugin()],
};

if (isWatch) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
} else {
    await esbuild.build(config);
}
