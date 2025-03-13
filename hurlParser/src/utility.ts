import { readFileSync } from "fs";

export function readText(file: string) {
  return readFileSync(file).toString();
}
