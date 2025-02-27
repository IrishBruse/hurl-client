import * as esbuild from "esbuild";
import { writeFile } from "fs/promises";

/** @type {import("esbuild").BuildOptions} */
const config = {
    entryPoints: ["src/main.tsx"],
    outfile: "build/hurl-editor.js",
    bundle: true,
    metafile: true,
    minify: true,
    treeShaking: true,
    format: "esm",
    target: "es2020",
    logLevel: "debug",
    external: ["child_process"],
};

const meta = await esbuild.build(config);

await writeFile("meta.json", JSON.stringify(meta.metafile));

const ctx = await esbuild.context(config);

await ctx.watch();
