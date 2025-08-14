import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../../ui/Dialog";
import { Eye, EyeOff, Shield, User, UserPlus } from "lucide-react";
import { Label } from "../../common/Label";
import { Input } from "../../common/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../common/Select";
import { Badge } from "../../common/Badge";
import { useRegister } from "../../auth/useAuth";
import type { Role } from "../../../types/auth.interfaces";

export interface Staff {
  displayName: string;
  userName: string;
  password: string;
  role: Role;
}

interface UserRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegisterUser: (userData: Omit<Staff, never>) => void;
}

export function UserRegistrationDialog({
  open,
  onOpenChange,
  onRegisterUser,
}: UserRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    role: "admin" as Role,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: register } = useRegister();

  const resetForm = () => {
    setFormData({
      displayName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.displayName.trim()) {
        toast.error("يرجى إدخال الاسم الكامل");
        return;
      }

      if (!formData.userName.trim()) {
        toast.error("يرجى إدخال اسم المستخدم");
        return;
      }

      if (formData.userName.length < 3) {
        toast.error("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
        return;
      }

      if (!formData.password) {
        toast.error("يرجى إدخال كلمة المرور");
        return;
      }

      if (formData.password.length < 4) {
        toast.error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("كلمة المرور وتأكيدها غير متطابقتان");
        return;
      }

      // Create user data
      const userData: Omit<Staff, never> = {
        displayName: formData.displayName.trim(),
        userName: formData.userName.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      try {
        onRegisterUser(userData);
        register(userData, {
          onSuccess: () => {
            resetForm();
            onOpenChange(false);
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("حدث خطأ أثناء إنشاء المستخدم");
        }
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء إنشاء المستخدم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay open={open} onClose={handleClose} />
      <DialogContent
        open={open}
        className="max-h-[90vh] max-w-md overflow-y-auto"
      >
        <DialogHeader className="my-3 text-right">
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-[#8b4513]" />
            <span>تسجيل مستخدم جديد</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-right text-[#5d4037]">
              الاسم الكامل *
            </Label>
            <Input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="border-[#8b4513]/30 text-right"
              placeholder="أدخل الاسم الكامل"
            />
          </div>

          {/* userName */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-right text-[#5d4037]">
              اسم المستخدم *
            </Label>
            <Input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, userName: e.target.value }))
              }
              className="border-[#8b4513]/30 text-right"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          {/* Email (Optional) */}
          {/* <div className="space-y-2">
            <Label htmlFor="email" className="text-right text-[#5d4037]">
              البريد الإلكتروني (اختياري)
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border-[#8b4513]/30 text-right"
              placeholder="أدخل البريد الإلكتروني"
             
            />
          </div> */}

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-right text-[#5d4037]">نوع الحساب *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: string) =>
                setFormData((prev) => ({
                  ...prev,
                  role: value as "admin" | "seller",
                }))
              }
            >
              <SelectTrigger>
                {formData.role === "admin" ? "مدير" : "بائع"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller">
                  <div key={0} className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>بائع</span>
                  </div>
                </SelectItem>
                <SelectItem key={1} value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>مدير</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-right text-[#5d4037]">
              كلمة المرور *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="border-[#8b4513]/30 pl-10 text-right"
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-[#6d4c41] hover:text-[#5d4037]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-right text-[#5d4037]"
            >
              تأكيد كلمة المرور *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="border-[#8b4513]/30 pl-10 text-right"
                placeholder="أعد إدخال كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-[#6d4c41] hover:text-[#5d4037]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Role Badge Preview */}
          <div className="flex justify-center">
            <Badge
              variant={formData.role === "admin" ? "default" : "secondary"}
              className={
                formData.role === "admin"
                  ? "bg-[#8b4513] text-white"
                  : "bg-[#f5e6d3] text-[#5d4037]"
              }
            >
              {formData.role === "admin" ? (
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>مدير</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>بائع</span>
                </div>
              )}
            </Badge>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-md border-[#8b4513]/30 px-4 py-2 text-[#5d4037] hover:bg-[#f5f5dc]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-[#8b4513] px-4 py-2 text-white hover:bg-[#5d4037]"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء حساب"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
