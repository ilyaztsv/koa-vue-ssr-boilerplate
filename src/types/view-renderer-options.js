// @flow

export type ViewRendererOptions = {
  // path.resolve(rootPath, './www')
  baseDir: string,
  // path.resolve(rootPath, 'www/index.template.html')
  template: string,
  // path.resolve(rootPath, 'www/static/vue-ssr-server-bundle.json')
  bundle: string,
  // path.resolve(rootPath,'www/static/vue-ssr-client-manifest.json')
  clientManifest: string,
  // false
  devMode: boolean,
  // path.resolve(rootPath, 'build/setup-dev-server')
  devServer: string
};
