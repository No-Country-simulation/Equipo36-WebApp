import { cn } from "clsx-for-tailwind";
import { useLocation } from "react-router";
import Tab from "../ui/Tab";
import TabGroup from "../ui/TabGroup";

interface Props {
  tabs: {
    title: string;
    path: string;
  }[];
}
const SidebarLayout = ({ tabs }: Props) => {
  const location = useLocation();

  let i = 1;

  return (
    <aside className={cn("w-[250px] h-full", "border-r border-[#E5E7EB]")}>
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
    </aside>
  );
};

export default SidebarLayout;
