import Navbar from "../components/common/Navbar";
import AdminHome from "../components/home/AdminHome";
import SellerHome from "../components/home/SellerHome";
import { useAppContext } from "../context/AppContext";

function Home() {
  const { role } = useAppContext();
  return (
    <div>
      <Navbar />
      {role === "admin" ? <AdminHome /> : <SellerHome />}
    </div>
  );
}

export default Home;
