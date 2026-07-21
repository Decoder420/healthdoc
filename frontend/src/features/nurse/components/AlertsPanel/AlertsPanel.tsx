import { ALERTS } from "../../../../lib/data/alerts";

const ALERT_STYLES = {
  Critical:
    "border-l-4 border-red-500 bg-red-50",

  Warning:
    "border-l-4 border-yellow-500 bg-yellow-50",

  Info:
    "border-l-4 border-blue-500 bg-blue-50",
};

export default function AlertsPanel() {
  return (
    <section className="surface-card p-6">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Critical Alerts
        </h2>

        <p className="text-sm text-muted-foreground">
          Recent patient alerts requiring attention.
        </p>
      </div>

      <div className="space-y-4">

        {ALERTS.map((alert) => (

          <div
            key={alert.id}
            className={`rounded-lg p-4 ${ALERT_STYLES[alert.severity]}`}
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  {alert.patientName}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Bed {alert.bedNumber}
                </p>

              </div>

              <span className="text-xs font-semibold">
                {alert.severity}
              </span>

            </div>

            <p className="mt-3 text-sm">
              {alert.message}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}