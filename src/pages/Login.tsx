import { useState } from "react";
import Logo from "../components/common/Logo";
import { Store } from "lucide-react";
import { useLogin } from "../components/auth/useLogin";
import { Input } from "../components/common/Input";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login({
      userName: username,
      password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2EFE0] p-5">
      <div className="border-primary/20 w-full max-w-md rounded-xl border-2 bg-white shadow-xl">
        <div className="flex flex-col items-center space-y-4 pt-6 text-center">
          <Logo size="lg" />
          <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-secondary-foreground text-2xl">محلات الزيني</h1>
          <p className="text-muted-foreground">
            سجّل الدخول لإدارة متجر الجلود والمواد الخاص بك
          </p>
        </div>

        <div className="mt-5 space-y-6 p-5 px-7">
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">اسم المستخدم</label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="py-5"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">كلمة المرور</label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-5"
                required
              />
            </div>

            {/* TODO: hide for now */}
            {/* <div className="flex flex-col gap-2">
              <label>اختر الدور</label>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      role === "seller" ? "bg-primary" : "bg-white"
                    } `}
                  ></div>
                  <label
                    htmlFor="seller"
                    className="border-primary/20 flex cursor-pointer items-center space-x-3 rounded-lg border px-4 py-3 transition-colors hover:bg-[#f5f5dc]/50"
                    onClick={() => setRole("seller")}
                  >
                    <User className="text-primary h-4 w-4" />
                    <span>بائع</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      role === "admin" ? "bg-primary" : "bg-white"
                    } `}
                  ></div>
                  <label
                    htmlFor="admin"
                    className="border-primary/20 flex cursor-pointer items-center space-x-3 rounded-lg border px-4 py-3 transition-colors hover:bg-[#f5f5dc]/50"
                    onClick={() => setRole("admin")}
                  >
                    <Shield className="text-primary h-4 w-4" />
                    <span>مدير</span>
                  </label>
                </div>
              </div>
            </div> */}

            <button
              type="submit"
              className="bg-primary mt-5 h-12 w-full cursor-pointer rounded-md text-white transition-colors disabled:pointer-events-none disabled:opacity-50"
              disabled={!username.trim() || !password.trim() || isPending}
            >
              {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
