"use client";

const consumables = [
  { name: "Gloves", current: 92 },
  { name: "Syringes", current: 78 },
  { name: "Face Masks", current: 55 },
  { name: "IV Sets", current: 66 },
  { name: "Catheters", current: 42 },
  { name: "Cotton Rolls", current: 88 },
];

export default function ConsumablesProgress() {
  return (
    <div className="surface-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Consumables Stock
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Current stock level of frequently used consumables
      </p>

      <div className="mt-6 space-y-5">
        {consumables.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>

              <span className="text-sm font-semibold text-primary">
                {item.current}%
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.current}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}