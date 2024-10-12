import { isDevEnv } from "env/client";

export default function ScreenLog({ toLog }: { toLog: any }) {
  if (!isDevEnv()) return null;

  return <pre>{JSON.stringify(toLog, null, 2)}</pre>;
}
