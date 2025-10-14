import { Card } from "../ui/card";

export function StatsCard({ title, value, icon, trend }) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p
          className={`text-sm ${
            trend.type === "positive"
              ? "text-green-500"
              : trend.type === "negative"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {trend.value}
        </p>
      </div>
      <div className="text-blue-600">{icon}</div>
    </Card>
  );
}
