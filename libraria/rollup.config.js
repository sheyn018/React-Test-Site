/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import preserveDirectives from "rollup-plugin-preserve-directives";
import dts from "rollup-plugin-dts";


const packageJson = require("./package.json");
const external = ["react/jsx-runtime", /node_modules/];
const cjsExternal = [...Object.keys(packageJson.peerDependencies), ...external];
const esmExternal = [...Object.keys(packageJson.peerDependencies), ...external, /@tiptap\/.*/];
const plugins = [
  commonjs(),
  nodeResolve(),
  postcss({
    extract: true,
  }),
  json(),
  preserveDirectives.default(),
  terser({
    compress: {
      directives: false,
    },
  }),

];
export default [
  {
    input: "src/index.ts",
    external: cjsExternal,
    output: [
      {
        dir: "dist/cjs",
        format: "cjs",
        entryFileNames: "[name].cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: false
      },
    ],
    plugins: [
      ...plugins,
      typescript({ tsconfig: 'tsconfig.json' }) // for the CJS build
    ],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      warn(warning);
    },
  },
  {
    input: "src/index.ts",
    external: esmExternal,
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: false
      },
    ],
    plugins: [
      ...plugins,
      typescript({ tsconfig: 'tsconfig.esm.json' }) // for the CJS build
    ],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
        return;
      }
      warn(warning);
    },
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts.default()],
  },
];
