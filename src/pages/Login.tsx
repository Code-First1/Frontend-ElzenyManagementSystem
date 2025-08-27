import { useState } from "react";
import Logo from "../components/common/Logo";
import { Eye, EyeOff, Store } from "lucide-react";
import { useLogin } from "../components/auth/useAuth";
import { Input } from "../components/common/Input";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

            <div className="relative flex flex-col gap-2">
              <label htmlFor="password">كلمة المرور</label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-5"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-secondary-foreground absolute bottom-1 left-3 -translate-y-1/2 transform text-[#6d4c41]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

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
