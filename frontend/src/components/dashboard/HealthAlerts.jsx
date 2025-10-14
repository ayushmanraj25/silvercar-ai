import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Heart } from "lucide-react";

export function HealthAlerts() {
  const alerts = [
    { name: "John Doe", issue: "High Blood Pressure", status: "Critical" },
    { name: "Mary Anne", issue: "Low Sugar Level", status: "Warning" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-red-500" />
          Health Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.map((a, i) => (
          <div key={i} className="p-3 border-b last:border-none">
            <p className="font-semibold">{a.name}</p>
            <p className="text-sm text-gray-600">{a.issue}</p>
            <span
              className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                a.status === "Critical"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {a.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
