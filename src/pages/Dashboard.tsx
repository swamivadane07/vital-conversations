import { SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <MainSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <TopBar />
            <Breadcrumbs />
            <main className="flex-1 overflow-y-auto">
              <div className="h-full">
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </div>
            </main>
          </div>
          <ScrollToTop />
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;