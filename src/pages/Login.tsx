import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faStore, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Logo from "../components/Logo";

type Role = "admin" | "shopkeeper";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("shopkeeper");

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#F2EFE0] p-5"
    >
      <div className="w-full max-w-md rounded-xl border-2 border-[#8b4513]/20 bg-white shadow-xl">
        <div className="flex flex-col items-center space-y-4 pt-6 text-center">
          <Logo />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8b4513]">
            <FontAwesomeIcon icon={faStore} className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl text-[#5d4037]">محلات الزيني</h1>
          <p className="text-[#6d4c41]">
            سجّل الدخول لإدارة متجر الجلود والمواد الخاص بك
          </p>
        </div>

        <div className="mt-5 space-y-6 p-5 px-7">
          <form onSubmit={() => {}} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">اسم المستخدم</label>
              <input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus-visible:border-ring focus-visible:ring-ring/50 h-12 rounded-md border border-[#8b4513]/20 px-3 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">كلمة المرور</label>
              <input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:border-ring focus-visible:ring-ring/50 h-12 rounded-md border border-[#8b4513]/20 px-3 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>اختر الدور</label>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      role === "shopkeeper" ? "bg-[#8b4513]" : "bg-white"
                    } `}
                  ></div>
                  <label
                    htmlFor="shopkeeper"
                    className="flex cursor-pointer items-center space-x-3 rounded-lg border border-[#8b4513]/20 px-4 py-3 transition-colors hover:bg-[#f5f5dc]/50"
                    onClick={() => setRole("shopkeeper")}
                  >
                    <FontAwesomeIcon icon={faUser} className="text-[#6d4c41]" />
                    <span>بائع</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      role === "admin" ? "bg-[#8b4513]" : "bg-white"
                    } `}
                  ></div>
                  <label
                    htmlFor="admin"
                    className="flex cursor-pointer items-center space-x-3 rounded-lg border border-[#8b4513]/20 px-4 py-3 transition-colors hover:bg-[#f5f5dc]/50"
                    onClick={() => setRole("admin")}
                  >
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      className="text-[#6d4c41]"
                    />
                    <span>مدير</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-md bg-[#8b4513] text-white transition-colors disabled:pointer-events-none disabled:opacity-50"
              disabled={!username.trim() || !password.trim()}
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
