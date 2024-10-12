const isDevEnv = () =>
  (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development") === "development";

const isProdEnv = () =>
  (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "production") === "production";

export { isDevEnv, isProdEnv };
