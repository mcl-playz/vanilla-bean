import { transformAsync } from "@babel/core";
import jsxTransformPkg from "@babel/plugin-transform-react-jsx";
import signals from "../babel/signals.ts";
import thunkPlugin from "../babel/jsx-thunk.ts";
import directives from "../babel/directives.ts";
import autoJsxRuntime from "../babel/auto-runtime.ts";
import type { Ctx } from "./index.ts";

const jsxTransform = (jsxTransformPkg as any).default ?? jsxTransformPkg;

export function jsxPlugin(ctx: Ctx): any {
  return {
    name: "framework:jsx",
    enforce: "pre",
    async transform(code: string, id: string, opts: any) {
      if (!/\.jsx$/.test(id.split("?")[0])) return null;
      const browser = !ctx.ssrBuild && !opts?.ssr;
      const result = await transformAsync(code, {
        filename: id,
        sourceMaps: true,
        babelrc: false,
        configFile: false,
        plugins: [
          signals,
          thunkPlugin,
          [directives, { server: ctx.ssrBuild, browser }],
          [jsxTransform, { runtime: "classic", pragma: "h", pragmaFrag: "Fragment" }],
          [autoJsxRuntime, { source: "vanilla-bean" }],
        ],
      });
      return { code: result!.code, map: result!.map };
    },
  };
}
