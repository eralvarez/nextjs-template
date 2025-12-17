import { DashboardLayout } from 'components/layouts/dashboardLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
