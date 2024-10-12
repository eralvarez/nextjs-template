import Link from "next/link";

export default function Home() {
  return (
    <div>
      <span>Homepage</span>

      <br />
      <Link href="/app">go to app</Link>
    </div>
  );
}
