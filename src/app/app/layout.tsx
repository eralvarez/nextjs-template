import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const navbarMenu = [
  {
    href: "/app",
    label: "Home",
  },
  {
    href: "/app",
    label: "Home 2",
  },
  {
    href: "/app",
    label: "Home 3",
  },
  {
    href: "/app",
    label: "Home 4",
  },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-row">
      <aside className="hidden lg:block lg:min-w-64 bg-gray-700 text-white pt-4">
        <ul className="px-3 flex flex-col gap-2">
          {navbarMenu.map((navbarItem) => (
            <Link href={navbarItem.href} key={navbarItem.label}>
              <li className="h-10 hover:bg-slate-600 cursor-pointer flex justify-start items-center rounded-md px-2">
                {navbarItem.label}
              </li>
            </Link>
          ))}
        </ul>
      </aside>
      <div className="flex flex-grow flex-col">
        <header className="flex min-h-14 shadow-md flex-row justify-end items-center px-4">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </header>

        <div className="w-full flex-grow overflow-y-auto">
          <section
            data-testid="content"
            className="mx-auto mt-8 mb-6 px-4 lg:px-0 lg:w-3/4"
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
