import HomeLayout from "../layouts/HomeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import AdminAnalysis from "../components/admin/AdminAnalysis";
import AdminSalesReports from "../components/admin/AdminSalesReports";
import AdminOverview from "../components/admin/AdminOverview";
import AdminProducts from "../components/admin/products/AdminProducts";
import AdminCategoires from "../components/admin/AdminCategoires";

export default function AdminDashboard() {
  return (
    <HomeLayout>
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-secondary-foreground text-3xl font-bold">
            لوحة الإدارة
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة المنتجات والفئات وعرض تحليلات المبيعات
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-5">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            المنتجات
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            الفئات
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            تقارير المبيعات
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            التحليلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminOverview />
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <AdminProducts />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <AdminCategoires />
        </TabsContent>

        <TabsContent value="sales">
          <AdminSalesReports />
          <div />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdminAnalysis />
        </TabsContent>
      </Tabs>
    </HomeLayout>
  );
}
