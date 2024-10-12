import Link from "next/link";

export default function Home() {
  return (
    <div>
      <span>Homepage</span>

      <br />
      <Link href="/app">app</Link>
    </div>
  );
}
