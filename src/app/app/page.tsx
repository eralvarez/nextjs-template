import Link from "next/link";

import DashboardHeader from "components/DashboardHeader";
import Button from "components/Button";
import DashboardPageLayout from "components/DashboardPageLayout";

export const dynamic = "force-dynamic";

export default function AppHomePage() {
  return (
    <DashboardPageLayout>
      <DashboardHeader title="Apps" subtitle="app home" />

      <section id="actions">
        <Link href="/app">
          <Button>Create new</Button>
        </Link>
      </section>

      <h2>No records found</h2>
    </DashboardPageLayout>
  );
}
