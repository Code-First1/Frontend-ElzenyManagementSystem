import { NavLink } from "react-router-dom";

interface NavbarLinkProps {
  to: string;
  icon: React.ElementType;
  text: string;
}

function NavbarLink({ to, icon: Icon, text }: NavbarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md px-3 py-2 ${
          isActive
            ? "bg-primary text-white"
            : "text-secondary-foreground font-semibold hover:bg-[#F2EFE0]"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <p>{text}</p>
    </NavLink>
  );
}

export default NavbarLink;
