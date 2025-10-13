import Roadmap from '@/components/Roadmap';
import { roadmapData } from '@/data/roadmapData';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Roadmap data={roadmapData} />
    </div>
  );
}
