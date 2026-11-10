import { publishBuiltPackage } from './publish-package.mjs';

publishBuiltPackage({ cwd: process.cwd() }).catch((error) => {
  console.error(`Release stopped safely: ${error.message}`);
  process.exitCode = 1;
});
