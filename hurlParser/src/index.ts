import { spawnSync } from "child_process";
import { Hurl, HurlParseResult } from "./types";
import { validateEntry } from "./validate";

export function parseHurl(text: string): HurlParseResult {
    const hurlfmt = spawnSync("hurlfmt", ["--out", "json"], {
        input: text,
        encoding: "utf8",
    });

    if (hurlfmt.status !== 0) {
        return {
            sucess: false,
            error: hurlfmt.stderr,
        };
    }

    return {
        sucess: true,
        data: JSON.parse(hurlfmt.stdout),
    };
}

export function stringifyHurl(hurlFile: Hurl) {
    if (!validateHurlFile(hurlFile)) {
        console.error("error");
    }
}

export function validateHurlFile(hurlFile: Hurl) {
    if (typeof hurlFile !== "object" || hurlFile === null) {
        return false;
    }

    for (const entry of hurlFile.entries) {
        if (!validateEntry(entry)) {
            return false;
        }
    }

    return true;
}
