import type { ReactNode } from "react";
import Navbar from "../components/common/Navbar";

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-20 space-y-6 p-6">{children}</div>
    </div>
  );
}

export default HomeLayout;
