import { Children, isValidElement, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const TabGroup = ({ children }: Props) => {
  const items = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return <li>{child}</li>;
    }
  });

  return (
    <nav>
      <ul>{items}</ul>
    </nav>
  );
};

export default TabGroup;
