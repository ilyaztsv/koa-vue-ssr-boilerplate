// @flow

import type { ViewRendererOptions } from './view-renderer-options';

export type ServerOptions = {
  productionMode: boolean,
  port: number,
  rendererOptions: ViewRendererOptions
};
