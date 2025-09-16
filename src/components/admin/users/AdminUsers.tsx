import { Shield, User, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../../../ui/Card";
import { Badge } from "../../common/Badge";
import { UserRegistrationDialog, type Staff } from "./UserRegistrationDialog";
import { useDeleteUser, useGetAllUsersQuery } from "../../auth/useAuth";
import Loader from "../../common/Loader";
import DeleteDialog from "../DeleteDialog";
import { useAppContext } from "../../../context/AppContext";

function AdminUsers() {
  const [isUserRegDialogOpen, setIsUserRegDialogOpen] = useState(false);
  const { data: users, isLoading } = useGetAllUsersQuery();
  const { mutate: deleteUser } = useDeleteUser();
  const { currentUser } = useAppContext();

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
        <h2 className="text-secondary-foreground text-xl font-semibold">
          إدارة المستخدمين
        </h2>
        <button
          onClick={() => setIsUserRegDialogOpen(true)}
          className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
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
          <Card className="border-primary/20">
            <CardContent className="flex flex-col items-center p-8">
              <Users className="text-primary/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-secondary-foreground mb-2 text-lg font-semibold">
                لا يوجد مستخدمين مسجلين
              </h3>
              <p className="text-muted-foreground mb-4">
                قم بإضافة أول مستخدم للنظام
              </p>
              <button
                onClick={() => setIsUserRegDialogOpen(true)}
                className="bg-primary hover:bg-secondary-foreground flex items-center gap-1 rounded-md px-4 py-2 text-white"
              >
                <UserPlus className="mt-1 h-4 w-4" />
                <span>إضافة مستخدم</span>
              </button>
            </CardContent>
          </Card>
        ) : (
          users
            ?.filter((user) => user.displayName !== currentUser?.displayName)
            .map((user, i) => (
              <Card
                key={i}
                className="group border-primary/15 hover:border-primary/25 rounded-xl border bg-white transition-all duration-200 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* User Avatar */}
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors duration-200 ${
                        user.role === "Admin"
                          ? "border-primary/30 bg-primary/10 border"
                          : "bg-secondary/90"
                      }`}
                    >
                      {user.role === "Admin" ? (
                        <Shield className="text-primary h-7 w-7" />
                      ) : (
                        <User className="text-secondary-foreground h-7 w-7" />
                      )}
                    </div>

                    {/* User Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-secondary-foreground flex flex-col truncate text-lg font-semibold">
                          {user.displayName}
                          <span className="text-sm font-normal">
                            {user.userName}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`capitalize ${
                              user.role === "Admin"
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "text-secondary-foreground bg-[#d7b899]"
                            }`}
                          >
                            {user.role === "Admin" ? "مدير" : "بائع"}
                          </Badge>
                          <DeleteDialog
                            entityName="مستخدم"
                            itemName={user.displayName}
                            onClick={() => deleteUser(user.userName)}
                          />
                        </div>
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
