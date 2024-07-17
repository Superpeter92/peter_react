import { NavLink } from "react-router-dom";

const SidebarNavLink: React.FC<{
  to: string;
  className: string | (({ isActive }: { isActive: boolean }) => string);
  children: React.ReactNode;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ to, className, children, setSidebarOpen }) => (
  <NavLink
    to={to}
    className={typeof className === "function" ? className : () => className}
    onClick={setSidebarOpen ? () => setSidebarOpen(false) : () => {}}
  >
    {children}
  </NavLink>
);

export default SidebarNavLink;
