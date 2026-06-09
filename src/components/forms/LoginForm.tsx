import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { loginSchema, type LoginFormValues } from "../../validations/auth";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (_data: LoginFormValues) => {
    try {
      // API call placeholder
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem("qb_admin_auth_token", "dummy-token");
      toast.success(t("common.success" as any) || "Welcome back!", { icon: "👋" });
      onSuccess();
    } catch (err) {
      toast.error(t("auth.messages.invalidCredentials", "Invalid credentials."));
    } finally { };
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto">
      <div className="flex flex-col mb-8 text-center sm:text-left">
        <h2 className="text-h1 font-bold text-card-foreground mb-2 tracking-tight">
          {t("auth.login.title")}
        </h2>
        <p className="text-auth-text/80 text-description">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Input
          label={t("auth.login.fields.email.label")}
          type="email"
          placeholder={t("auth.login.fields.email.placeholder")}
          prefixElement={<Mail size={18} className="text-muted-foreground" />}
          error={errors.email?.message}
          required
          spellCheck={false}
          {...register("email")}
        />

        <Input
          label={t("auth.login.fields.password.label")}
          type={showPassword ? "text" : "password"}
          placeholder={t("auth.login.fields.password.placeholder")}
          prefixElement={<Lock size={18} className="text-muted-foreground" />}
          suffixElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none p-1 rounded-md hover:bg-input"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.password?.message}
          required
          spellCheck={false}
          {...register("password")}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md mt-2 py-6 text-body"
        >
          {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
        </Button>
      </form>
    </div>
  );
};
