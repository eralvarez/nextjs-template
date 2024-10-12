import Link from "next/link";

import DashboardHeader from "components/DashboardHeader";
import Button from "components/Button";
import DashboardPageLayout from "components/DashboardPageLayout";

export const dynamic = "force-dynamic";

export default function MyAppsPage() {
  return (
    <DashboardPageLayout>
      <DashboardHeader title="Apps" subtitle="app home" />

      <section id="actions">
        <Link href="/app/project/create">
          <Button>Create new app</Button>
        </Link>
      </section>

      <h2>No projects found</h2>
    </DashboardPageLayout>
  );
}
