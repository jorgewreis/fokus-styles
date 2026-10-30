// Real packed-package installation: no workspace/source type aliases.
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const scratch = await mkdtemp(path.join(tmpdir(), "fokus-react-consumers-"));
const run = (command, args, cwd) => execFileSync(command, args, {cwd, stdio: "inherit"});
try {
  const packed = process.argv[2] ? null : JSON.parse(execFileSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], {cwd: root, encoding: "utf8"}));
  const tarball = process.argv[2] ? path.resolve(process.argv[2]) : path.join(scratch, packed[0].filename);
  for (const major of [18, 19]) {
    const cwd = path.join(scratch, "react-" + major);
    run("mkdir", ["-p", cwd], scratch);
    await writeFile(path.join(cwd, "package.json"), JSON.stringify({private: true, type: "module"}));
    run("npm", ["install", "--engine-strict", "--no-audit", "--no-fund", tarball,
      "react@" + major, "react-dom@" + major, "@types/react@" + major, "@types/react-dom@" + major, "typescript@5.9.3"], cwd);
    await writeFile(path.join(cwd, "consumer.tsx"), `import { ModalPanel, ModalTrigger, DropdownMenu, DropdownTrigger, TabList } from "fokus-styles/react";
const elements = [<ModalPanel id="m" />, <ModalTrigger target="#m" />, <DropdownMenu id="d" />, <DropdownTrigger target="#d" />, <TabList />];
export default elements;
`);
    run(process.execPath, ["node_modules/typescript/bin/tsc", "--noEmit", "--strict", "--skipLibCheck", "false", "--module", "NodeNext", "--target", "ES2022", "--jsx", "react-jsx", "consumer.tsx"], cwd);
    run(process.execPath, ["--input-type=module", "-e", 'import React from "react"; import {renderToString} from "react-dom/server"; import {ModalPanel} from "fokus-styles/react"; if(!renderToString(React.createElement(ModalPanel,{id:"m"})).includes("m")) throw Error("SSR failed")'], cwd);
    console.log("React " + major + ": installed package, strict declarations and SSR passed");
  }
} finally {
  await rm(scratch, {recursive: true, force: true});
}
