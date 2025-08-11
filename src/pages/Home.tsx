import AdminHome from "../components/home/AdminHome";
import SellerHome from "../components/home/SellerHome";
import { useAppContext } from "../context/AppContext";
import HomeLayout from "../layouts/HomeLayout";

function Home() {
  const { role } = useAppContext();
  return (
    <>
      <HomeLayout>
        {role === "admin" ? <AdminHome /> : <SellerHome />}
      </HomeLayout>
    </>
  );
}

export default Home;
