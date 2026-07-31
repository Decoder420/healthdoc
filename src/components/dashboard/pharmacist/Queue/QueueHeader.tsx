import { RefreshCw } from "lucide-react";

interface QueueHeaderProps {
  onRefresh: () => void;
   loading: boolean;
}

export default function QueueHeader({ onRefresh, loading }: QueueHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold">
          Prescription Queue
        </h1>

        <p className="text-sm text-muted-foreground">
          Review and dispense incoming prescriptions.
        </p>
      </div>

      <button
  className="btn btn-primary"
  onClick={onRefresh}
  disabled={loading}
>
  <RefreshCw
    size={16}
    className={loading ? "animate-spin" : ""}
  />

  {loading ? "Refreshing..." : "Refresh Queue"}
</button>
    </div>
  );
}