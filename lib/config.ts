export const DUMMYJSON_API = "https://dummyjson.com";

// Read once here, imported everywhere else that needs the environment —
// process.env.NODE_ENV is still inlined at build time wherever this constant
// ends up used, so branching on it stays dead-code-eliminated in production.
export const ENV = process.env.NODE_ENV;

console.log(ENV);
