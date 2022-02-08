// postcss.config.js

const tailwind = require('tailwindcss');
const cssnano = require('cssnano');
const postcss_import = require('postcss-import');
const presetEnv = require('postcss-preset-env')({
  features: {
    // enable nesting
    'nesting-rules': true,
  },
});

const plugins =
  process.env.NODE_ENV === 'production'
    ? [postcss_import, tailwind, presetEnv, cssnano]
    : [postcss_import, tailwind, presetEnv];

module.exports = { plugins };