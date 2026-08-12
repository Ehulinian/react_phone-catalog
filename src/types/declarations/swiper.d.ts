// swiper's package.json exposes its CSS through the "exports" map
// (e.g. "./css" -> "./swiper.css"), which only bundlers using modern
// "exports"-aware resolution understand. This project's tsconfig targets
// TypeScript 4.9 with the classic "node" moduleResolution (upgrading to
// "bundler" resolution needs TS 5+), so tsc can't resolve these side-effect
// imports on disk and flags them as missing modules — even though webpack
// (via CRA) resolves and bundles them correctly at build time. This just
// tells TypeScript the module exists.
declare module 'swiper/css';
declare module 'swiper/css/*';
