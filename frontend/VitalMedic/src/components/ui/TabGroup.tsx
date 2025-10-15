import { Children, isValidElement, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const TabGroup = ({ children }: Props) => {
  const items = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return <li className="list-none flex-shrink-0 lg:flex-shrink">{child}</li>;
    }
  });

  return (
    <nav className="p-1 md:p-2">
      <ul className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-1 overflow-x-auto lg:overflow-x-visible">{items}</ul>
    </nav>
  );
};

export default TabGroup;
