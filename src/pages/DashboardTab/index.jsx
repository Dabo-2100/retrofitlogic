import SBvsTasks from "./SBvsTasks";
export default function DashboardTab() {
  return (
    <div
      className="workingTab p-3 d-flex flex-wrap align-items-start justify-content-start"
      id="DashboardTab"
    >
      <SBvsTasks />
    </div>
  );
}
