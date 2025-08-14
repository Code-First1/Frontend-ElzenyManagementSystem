import { Shield, User, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../../../ui/Card";
import { Badge } from "../../common/Badge";
import { UserRegistrationDialog, type Staff } from "./UserRegistrationDialog";
import { useGetAllUsersQuery } from "../../auth/useAuth";
import Loader from "../../common/Loader";

function AdminUsers() {
  const [isUserRegDialogOpen, setIsUserRegDialogOpen] = useState(false);
  const { data: users, isLoading } = useGetAllUsersQuery();

  const registerUser = (userData: Omit<Staff, never>) => {
    const existingUser = users?.find(
      (u) => u.userName.toLowerCase() === userData.userName.toLowerCase(),
    );
    if (existingUser) {
      throw new Error("اسم المستخدم موجود بالفعل");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#5d4037]">
          إدارة المستخدمين
        </h2>
        <button
          onClick={() => setIsUserRegDialogOpen(true)}
          className="flex items-center gap-1 rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
        >
          <UserPlus className="mt-1 h-4 w-4" />
          <span>تسجيل مستخدم جديد</span>
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        {isLoading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader />
          </div>
        ) : users?.length === 0 ? (
          <Card className="border-[#8b4513]/20">
            <CardContent className="flex flex-col items-center p-8">
              <Users className="mx-auto mb-4 h-12 w-12 text-[#8b4513]/50" />
              <h3 className="mb-2 text-lg font-semibold text-[#5d4037]">
                لا يوجد مستخدمين مسجلين
              </h3>
              <p className="mb-4 text-[#6d4c41]">قم بإضافة أول مستخدم للنظام</p>
              <button
                onClick={() => setIsUserRegDialogOpen(true)}
                className="flex items-center gap-1 rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
              >
                <UserPlus className="mt-1 h-4 w-4" />
                <span>إضافة مستخدم</span>
              </button>
            </CardContent>
          </Card>
        ) : (
          users?.map((user, i) => (
            <Card
              key={i}
              className="group rounded-xl border border-[#8b4513]/15 bg-white transition-all duration-200 hover:border-[#8b4513]/25 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <div
                    className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors duration-200 ${
                      user.role === "Admin"
                        ? "border border-[#8b4513]/30 bg-[#8b4513]/10"
                        : "bg-[#f5e6d3]/90"
                    }`}
                  >
                    {user.role === "Admin" ? (
                      <Shield className="h-7 w-7 text-[#8b4513]" />
                    ) : (
                      <User className="h-7 w-7 text-[#5d4037]" />
                    )}
                  </div>

                  {/* User Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-lg font-semibold text-[#5d4037]">
                        {user.displayName}
                      </h3>
                      <Badge
                        className={`capitalize ${
                          user.role === "Admin"
                            ? "bg-[#8b4513] text-white hover:bg-[#8b4513]/90"
                            : "bg-[#d7b899] text-[#5d4037]"
                        }`}
                      >
                        {user.role === "Admin" ? "مدير" : "بائع"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* User Registration Dialog */}
      <UserRegistrationDialog
        open={isUserRegDialogOpen}
        onOpenChange={setIsUserRegDialogOpen}
        onRegisterUser={registerUser}
        // currentAdmin={currentUser}
      />
    </div>
  );
}

export default AdminUsers;
