import { OverviewCards } from './OverviewCards';
import { ChartsSection } from './ChartsSection';
import { HeatmapCalendar } from './HeatmapCalendar';
import { SessionLog } from './SessionLog';

export function StatsTab({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-4 py-4">
      <OverviewCards accentColor={accentColor} />
      <ChartsSection accentColor={accentColor} />
      <HeatmapCalendar accentColor={accentColor} />
      <SessionLog />
    </div>
  );
}
