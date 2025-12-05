/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: `${process.cwd()}/../..`,
    },
    autoprefixer: {},
  },
};

export default config;
