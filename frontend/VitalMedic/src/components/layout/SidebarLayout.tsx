import { cn } from "clsx-for-tailwind";
import { useLocation } from "react-router";
import Tab from "../ui/Tab";
import TabGroup from "../ui/TabGroup";
import { useAppSelector } from "../../hooks/reduxHooks";

interface Props {
  tabs: {
    title: string;
    path: string;
  }[];
}
const SidebarLayout = ({ tabs }: Props) => {
  const location = useLocation();
  const userProfile = useAppSelector((state) => state.auth.userProfile);

  // Debug log
  console.log('🔧 SidebarLayout: userProfile:', userProfile);

  let i = 1;

  return (
    <aside className={cn("w-full lg:w-[280px] lg:h-full")}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 md:p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm md:text-base">Portal de Salud</h2>
          <p className="text-xs md:text-sm text-gray-500">
            {userProfile?.firstName && userProfile?.lastName 
              ? `${userProfile.firstName} ${userProfile.lastName}`
              : "Usuario"
            }
          </p>
        </div>
        
        {/* Navigation - horizontal scroll en mobile */}
        <div className="lg:block">
          <div className="flex lg:block overflow-x-auto lg:overflow-x-visible">
            <TabGroup>
              {tabs.map((data) => (
                <Tab
                  key={++i}
                  selected={data.path === location.pathname}
                  to={data.path}
                >
                  {data.title}
                </Tab>
              ))}
            </TabGroup>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarLayout;
