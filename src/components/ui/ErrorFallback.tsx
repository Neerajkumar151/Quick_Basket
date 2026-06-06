import React from "react";
import type { FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import en from "../../locales/en.json";

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <div className="w-16 h-16 rounded-lg bg-error/10 flex items-center justify-center">
          <AlertTriangle size={32} className="text-error" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-h3 text-foreground">
            {en.common.errorBoundary.title}
          </h1>
          <p className="text-description text-muted-foreground leading-relaxed">
            {en.common.errorBoundary.description}
          </p>
        </div>

        {(error as Error)?.message && (
          <pre className="w-full text-left text-caption bg-input border border-border rounded-lg p-4 text-error overflow-auto max-h-32">
            {(error as Error).message}
          </pre>
        )}

        <Button
          type="button"
          variant="primary"
          onClick={resetErrorBoundary}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          {en.common.errorBoundary.retry}
        </Button>
      </div>
    </div>
  );
};
