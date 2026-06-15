import React from "react";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route Error Boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    // Force reload bypassing cache to get the latest chunks
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkLoadError =
        this.state.error?.name === "ChunkLoadError" ||
        this.state.error?.message?.includes("Failed to fetch dynamically imported module");

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center bg-card rounded-xl border border-border shadow-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-3 tracking-tight">
            {isChunkLoadError
              ? "New Update Available"
              : "Something went wrong"}
          </h2>
          <p className="text-description text-muted-foreground mb-8 max-w-md">
            {isChunkLoadError
              ? "A new version of the dashboard is available. Please reload the page to continue."
              : "An unexpected error occurred while loading this page. Please try again or contact support if the issue persists."}
          </p>
          <Button
            onClick={this.handleReload}
            className="gap-2 px-8"
            size="lg"
          >
            <RefreshCcw size={18} />
            {isChunkLoadError ? "Reload Application" : "Try Again"}
          </Button>
          
          {!isChunkLoadError && this.state.error && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left w-full max-w-2xl overflow-auto border border-border/50">
              <p className="text-caption font-mono text-error font-medium mb-1">Error Details:</p>
              <pre className="text-caption font-mono text-muted-foreground whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
