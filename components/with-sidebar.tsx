// sidebar component from https://gist.github.com/sturmenta/2dc2006ee17a8529fc63535b82626721
import { MenuIcon } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const WithMobileSidebar = ({
  children,
  sidebarContent: SidebarContent,
  mobileDashboardHeader: MobileDashboardHeader,
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
  mobileDashboardHeader?: () => JSX.Element;
}) => {
  return (
    <>
      <Sheet>
        <div className="mt-5 flex md:hidden">
          <div className="flex flex-1">{MobileDashboardHeader && <MobileDashboardHeader />}</div>
          <SheetTrigger>
            <MenuIcon size={24} />
          </SheetTrigger>
        </div>
        <SheetContent side="left">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
};

const WithDesktopSidebar = ({
  children,
  sidebarContent: SidebarContent,
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
}) => {
  return (
    // style used from here -> https://github.com/shadcn-ui/ui/blob/1cf5fad881b1da8f96923b7ad81d22d0aa3574b9/apps/www/app/docs/layout.tsx#L12
    <div className="px-8 md:px-0 h-screen flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-screen w-full shrink-0 border-r md:sticky md:block bg-nav-primary">
        <div className="h-full p-4">
          <SidebarContent />
        </div>
      </aside>
      {children}
    </div>
  );
};

export const WithSidebar = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  sidebarContent: () => JSX.Element;
  mobileDashboardHeader?: () => JSX.Element;
}) => {
  return (
    <WithDesktopSidebar {...props}>
      <WithMobileSidebar {...props}>{children}</WithMobileSidebar>
    </WithDesktopSidebar>
  );
};
