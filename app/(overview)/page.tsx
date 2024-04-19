import { DashboardNavigationMenu } from '@/app/ui/dashboard/navigation-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium mb-6">Start</h2>
        <div className="text-xs text-gray-800">
          <DashboardNavigationMenu />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-medium mb-6">Recently</h2>
        <div className="text-xs text-gray-800">
          <Button variant="outline" className="p-6">
            New Page <ChevronDownIcon className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
