import { useQuery } from "@tanstack/react-query";
import AdminHome from "../components/home/AdminHome";
import SellerHome from "../components/home/SellerHome";
import { useAppContext } from "../context/AppContext";
import HomeLayout from "../layouts/HomeLayout";
import { createCrudApi } from "../services/apiCrud";

function Home() {
  const { currentUser } = useAppContext();
  const { data: revenueToday } = useQuery({
    queryKey: ["revenueToday"],
    queryFn: () => createCrudApi("Dashboard/revenue").getAll({ days: 1 }),
    select: (data) => Number(data) || 0,
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["lowStockProducts"],
    queryFn: () => createCrudApi("Dashboard/low-stock-products").getAll(),
    select: (data) => Number(data) || 0,
  });
  return (
    <>
      <HomeLayout>
        {currentUser?.role === "Admin" ? (
          <AdminHome
            revenueToday={revenueToday ?? 0}
            lowStockProducts={lowStockProducts ?? 0}
          />
        ) : (
          <SellerHome
            revenueToday={revenueToday ?? 0}
            lowStockProducts={lowStockProducts ?? 0}
          />
        )}
      </HomeLayout>
    </>
  );
}

export default Home;
