import type { RollupOptions } from 'rollup';
import { terser } from 'rollup-plugin-terser';

import { pkgName, outputFilePrefix, commonConfig } from './rollup.config';

const config: RollupOptions = {
  ...commonConfig,
  output: [
    {
      format: 'umd',
      file: `${outputFilePrefix}.umd.js`,
      name: pkgName,
      sourcemap: true
    },
    {
      format: 'umd',
      file: `${outputFilePrefix}.umd.min.js`,
      name: pkgName,
      sourcemap: true,
      plugins: [terser()]
    }
  ]
};

export default config;
