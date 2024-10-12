interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: Readonly<DashboardHeaderProps>) {
  return (
    <div id="dashboardHeader">
      <h1 className="text-4xl">{title}</h1>
      {Boolean(subtitle) && <span className="text-slate-700">{subtitle}</span>}
    </div>
  );
}
