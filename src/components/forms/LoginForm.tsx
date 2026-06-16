import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { loginSchema, type LoginFormValues } from "../../validations/auth";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../utils/api-client";
import { ENDPOINTS } from "../../constants/endpoints";
import { storage } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";

interface LoginFormProps {
  onSuccess: (redirectUrl?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        email: data.email,
        password: data.password,
      });
      
      const payload = response.data?.data || response.data;
      
      // Store the real access token
      const token = payload?.accessToken;
      if (token) {
        storage.set("accessToken", token);
        setIsAuthenticated(true); // Sync AuthContext state immediately
      } else {
        console.warn("Login successful but no accessToken found in response!");
      }
      
      const onboarding = payload?.onboarding;
      
      if (onboarding && onboarding.status !== "APPROVED" && onboarding.status !== "COMPLETED") {
        toast.error("Please complete your store registration to access the dashboard.");
        
        let redirectUrl = "/onboarding/basic-info";
        if (onboarding.status === "PENDING" || onboarding.status === "UNDER_REVIEW") {
          redirectUrl = "/onboarding/pending";
        } else {
          switch (onboarding.currentStep) {
            case 1: redirectUrl = "/onboarding/basic-info"; break;
            case 2: redirectUrl = "/onboarding/location"; break;
            case 3: redirectUrl = "/onboarding/identity"; break;
            case 4: redirectUrl = "/onboarding/pending"; break;
            default: redirectUrl = "/onboarding/basic-info";
          }
        }
        onSuccess(redirectUrl);
      } else {
        toast.success(t("auth.login.success", "Welcome back!"), { icon: "👋" });
        onSuccess("/dashboard");
      }
    } catch (err: any) {
      if (!err.response) {
        toast.error(t("auth.messages.networkError", "Network error. Please check your connection and ensure the server is running."));
      } else if (err.response?.status >= 500) {
        toast.error(t("auth.messages.serverError", "Internal server error. Please try again later."));
      } else {
        toast.error(err.response?.data?.message || t("auth.messages.invalidCredentials", "Invalid credentials."));
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <div className="flex flex-col mb-10 text-center sm:text-left">
        <h2 className="text-h1 font-bold text-card-foreground mb-4 tracking-tight">
          {t("auth.login.title")}
        </h2>
        <p className="text-auth-text/80 text-description">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md mt-4 py-6 text-body"
        >
          {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
        </Button>
      </form>
    </div>
  );
};
