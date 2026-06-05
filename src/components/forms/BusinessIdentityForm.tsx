import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  File as FileIcon,
  X,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button, cn } from "../ui/Button";
import {
  businessIdentitySchema,
  type BusinessIdentityFormValues,
} from "../../validations/onboarding";
import en from "../../locales/en.json";

interface BusinessIdentityFormProps {
  onSubmit: (data: BusinessIdentityFormValues) => void;
  onPrevious: () => void;
}

export const BusinessIdentityForm: React.FC<BusinessIdentityFormProps> = ({
  onSubmit,
  onPrevious,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BusinessIdentityFormValues>({
    resolver: zodResolver(businessIdentitySchema),
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
      setError("registrationProof", {
        message: "Only PDF, PNG, and JPG formats are supported",
      });
      toast.error("Invalid file format. Please upload PDF, PNG, or JPG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("registrationProof", { message: "Max file size is 10MB" });
      toast.error("File is too large. Max allowed size is 10MB.");
      return;
    }
    clearErrors("registrationProof");
    setSelectedFile(file);
    setValue("registrationProof", [file]);

    // Create preview if it's an image
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    toast.success("Document attached successfully.");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setValue("registrationProof", undefined);
    toast("Document removed", { icon: "🗑️" });
  };

  const handleFinalSubmit = async (data: BusinessIdentityFormValues) => {
    console.log("Submitting Step 3:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSubmit(data);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 lg:p-10 shadow-sm">
        <h2 className="text-h2 font-bold text-card-foreground mb-2">
          {en.onboarding.identity.title}
        </h2>
        <p className="text-muted-foreground text-description mb-8">
          {en.onboarding.identity.subtitle}
        </p>

        <form
          id="identity-form"
          onSubmit={handleSubmit(handleFinalSubmit)}
          className="flex flex-col gap-6"
        >
          <Select
            label={en.onboarding.identity.fields.businessType.label}
            error={errors.businessType?.message}
            required
            {...register("businessType")}
          >
            <option value="">
              {en.onboarding.identity.fields.businessType.placeholder}
            </option>
            <option value="individual">
              {en.onboarding.identity.fields.businessType.options.individual}
            </option>
            <option value="proprietorship">
              {
                en.onboarding.identity.fields.businessType.options
                  .proprietorship
              }
            </option>
            <option value="partnership">
              {en.onboarding.identity.fields.businessType.options.partnership}
            </option>
            <option value="pvtLtd">
              {en.onboarding.identity.fields.businessType.options.pvtLtd}
            </option>
          </Select>

          <div className="flex flex-col">
            <Input
              label={en.onboarding.identity.fields.gstin.label}
              placeholder={en.onboarding.identity.fields.gstin.placeholder}
              error={errors.gstin?.message}
              spellCheck={false}
              {...register("gstin")}
            />
            {!errors.gstin?.message && (
              <p className="text-caption text-muted-foreground mt-1.5 ml-1">
                {en.onboarding.identity.fields.gstin.description}
              </p>
            )}
          </div>

          <Input
            label={en.onboarding.identity.fields.pan.label}
            placeholder={en.onboarding.identity.fields.pan.placeholder}
            error={errors.pan?.message}
            spellCheck={false}
            className="uppercase"
            required
            {...register("pan")}
          />

          <Input
            label={en.onboarding.identity.fields.registrationDate.label}
            type="date"
            placeholder={
              en.onboarding.identity.fields.registrationDate.placeholder
            }
            error={errors.registrationDate?.message}
            suffixElement={
              <Calendar
                size={16}
                className="text-muted-foreground pointer-events-none"
              />
            }
            className="date-input-custom"
            required
            {...register("registrationDate")}
          />

          {/* File Upload Zone */}
          <div className="flex flex-col gap-1.5 w-full mt-2">
            <label className="text-description font-medium text-foreground">
              {en.onboarding.identity.fields.proof.label}
              {/* <span className="text-muted-foreground text-caption ml-1 font-normal">(Optional)</span> */}
            </label>

            <div
              className={cn(
                "relative flex flex-col items-center justify-center w-full min-h-[140px] rounded-lg border-2 border-dashed transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border bg-input/50",
                errors.registrationProof ? "border-error bg-error/5" : "",
                "hover:bg-input",
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".pdf,image/png,image/jpeg"
                onChange={handleChange}
              />

              {!selectedFile ? (
                <div className="flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                  <Upload className="w-8 h-8 text-primary mb-3" />
                  <p className="text-description text-foreground">
                    <span className="font-semibold text-primary">
                      {en.onboarding.identity.fields.proof.upload}
                    </span>
                    {en.onboarding.identity.fields.proof.drag}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">
                    {en.onboarding.identity.fields.proof.formats}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-4 z-20 pointer-events-auto w-full h-full justify-center">
                  {previewUrl ? (
                    <div className="relative w-full h-32 flex justify-center items-center overflow-hidden rounded-md border border-border bg-black/50">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain drop-shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-primary/10 rounded-full mb-2">
                      <FileIcon className="w-8 h-8 text-primary" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full bg-background border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex flex-col overflow-hidden flex-1">
                      <span className="text-description font-medium text-foreground truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-auto p-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-full transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {errors.registrationProof && (
              <p className="text-caption text-error mt-1">
                {errors.registrationProof.message as string}
              </p>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} className="mr-2" />
            {en.onboarding.identity.buttons.previous}
          </Button>
          <Button
            type="submit"
            form="identity-form"
            disabled={isSubmitting}
            className="min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting
              ? en.onboarding.form.submitting
              : en.onboarding.identity.buttons.submit}
            {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
