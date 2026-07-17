import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DynamicCard from "@/components/dashboard/lab/Lab_KpiCards";

const cards = [
  {
    title: "Samples Collected",
    text: "248",
    icon: <ScienceRoundedIcon fontSize="large" />,
  },
  {
    title: "Pending Samples",
    text: "18",
    icon: <PendingActionsRoundedIcon fontSize="large" />,
  },
  {
    title: "In Process",
    text: "5",
    icon: <BiotechRoundedIcon fontSize="large" />,
  },
  {
    title: "Rejected Samples",
    text: "3",
    icon: <CancelRoundedIcon fontSize="large" />,
  },
  {
    title: "Reports Released",
    text: "120",
    icon: <DescriptionRoundedIcon fontSize="large" />,
  },
  {
    title: "Critical Alerts",
    text: "5",
    icon: <WarningAmberRoundedIcon fontSize="large" />,
    linkText: "View →",
    linkHref: "/pathology/critical_alerts",
  },
];

export default function DashboardCards(){
return(
    <>
<div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 lg:overflow-visible px-4">
  {cards.map((card) => (
    <div key={card.title} className="flex-shrink-0 lg:flex-shrink w-[240px] lg:w-full">
      <DynamicCard {...card} />
    </div>
  ))}
</div>
</>
)
}
