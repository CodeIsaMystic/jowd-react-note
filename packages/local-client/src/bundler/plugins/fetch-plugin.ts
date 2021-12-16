import axios from "axios"
import * as esbuild from "esbuild-wasm"
import localForage from "localforage"

const fileCache = localForage.createInstance({
  name: "filecache",
})

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // onLoad for index.js file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        }
      })

      // onLoad check if it's cached
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        )
        if (cachedResult) {
          return cachedResult
        }
      })

      // onLoad for CSS Files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path)

        // Starting handling .css files extension by tricking ESBuild
        const escapedCSSString = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedCSSString}';
          document.head.appendChild(style);
          `

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        }
        await fileCache.setItem(args.path, result)

        return result
      })

      // onLoad for any kind of arbitrary file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        }
        await fileCache.setItem(args.path, result)

        return result
      })
    },
  }
}
