import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
  sub: string;
}

export default function KpiCard({ label, value, sub }: Props) {
  return (
    <Card variant="global" size="kpi">
      <p className="text-xs text-text-2">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-text-2">{sub}</p>
    </Card>
  );
}
