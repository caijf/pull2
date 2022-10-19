import type { RollupOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export const outputDir = 'dist';
export const pkgName = 'pull2';
export const outputFilePrefix = `${outputDir}/${pkgName}`;
export const commonConfig = {
  input: 'src/index.ts',
  plugins: [
    resolve(),
    commonjs(),
    typescript({ include: ['src/**/*'] }),
    postcss({
      inject: true
    })
  ]
};

const config: RollupOptions = {
  ...commonConfig,
  output: [
    {
      format: 'cjs',
      file: `${outputFilePrefix}.cjs.js`
    },
    {
      format: 'es',
      file: `${outputFilePrefix}.esm.js`
    }
  ],
  external: ['tslib']
};

export default config;
