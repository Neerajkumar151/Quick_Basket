import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Store, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { basicInfoSchema, type BasicInfoFormValues } from "../../validations/onboarding";
import en from "../../locales/en.json";

interface BasicInfoFormProps {
  onNext: () => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ onNext }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
  });

  const onSubmit = async (data: BasicInfoFormValues) => {
    console.log("Submitting Step 1:", data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onNext();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-sm">
      <h2 className="text-h2 font-bold text-card-foreground mb-2">{en.onboarding.form.title}</h2>
      <p className="text-muted-foreground mb-8">{en.onboarding.form.subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={en.onboarding.form.fields.storeName.label}
            placeholder={en.onboarding.form.fields.storeName.placeholder}
            prefixElement={<Store size={16} className="text-muted-foreground" />}
            error={errors.storeName?.message}
            required
            spellCheck={false}
            {...register("storeName")}
          />
          <Input
            label={en.onboarding.form.fields.ownerName.label}
            placeholder={en.onboarding.form.fields.ownerName.placeholder}
            prefixElement={<User size={16} className="text-muted-foreground" />}
            error={errors.ownerName?.message}
            required
            spellCheck={false}
            {...register("ownerName")}
          />
          <Input
            label={en.onboarding.form.fields.email.label}
            type="email"
            placeholder={en.onboarding.form.fields.email.placeholder}
            prefixElement={<Mail size={16} className="text-muted-foreground" />}
            error={errors.email?.message}
            required
            spellCheck={false}
            {...register("email")}
          />
          <Input
            label={en.onboarding.form.fields.phone.label}
            type="tel"
            placeholder={en.onboarding.form.fields.phone.placeholder}
            prefixElement={<span className="text-description text-foreground font-medium pr-1 border-r border-border mr-1">{en.common.phonePrefix}</span>}
            error={errors.phone?.message}
            required
            spellCheck={false}
            {...register("phone")}
          />
          <Input
            label={en.onboarding.form.fields.password.label}
            type={showPassword ? "text" : "password"}
            placeholder={en.onboarding.form.fields.password.placeholder}
            prefixElement={<Lock size={16} className="text-muted-foreground" />}
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password?.message}
            required
            spellCheck={false}
            {...register("password")}
          />
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-description text-muted-foreground">
            {en.onboarding.form.hasAccount} <Link to="/login" className="text-primary hover:underline font-medium">{en.onboarding.form.signIn}</Link>
          </div>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px] w-full sm:w-auto">
            {isSubmitting ? en.onboarding.form.submitting : en.onboarding.form.submit}
            {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
};
