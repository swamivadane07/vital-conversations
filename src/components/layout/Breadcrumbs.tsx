import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/doctors": "Find Doctors",
  "/lab-tests": "Lab Tests",
  "/health-dashboard": "Health Dashboard",
  "/advanced-search": "Advanced Search",
  "/voice-input": "Voice Input",
  "/ai-analysis": "AI Analysis",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <div className="px-6 py-3 border-b bg-muted/30">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1 hover:text-primary">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const label = routeLabels[routeTo] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

            return (
              <div key={routeTo} className="flex items-center">
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo} className="hover:text-primary">
                        {label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}