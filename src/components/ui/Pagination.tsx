import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) return null;

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, "...", total];
    }
    if (current >= total - 3) {
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const pages = getPageNumbers(currentPage, totalPages);

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = parseInt(jumpPage, 10);
      if (isNaN(val) || val < 1 || val > totalPages) {
        toast.error(
          t(
            "common.invalidPageError",
            `Oops! Please enter a valid page number between 1 and {{max}}.`,
            { max: totalPages },
          ),
          {
            style: {
              fontSize: "var(--text-h5-size)",
              color: "hsl(var(--error))",
            },
          },
        );
      } else {
        onPageChange(val);
        setJumpPage("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpPage(e.target.value);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card rounded-xl border mt-4 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {t("common.previous", "Previous")}
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {t("common.next", "Next")}
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-description text-muted-foreground whitespace-nowrap">
            {t("common.showingPage", "Showing page")}{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            {t("common.of", "of")}{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-input focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">
                {t("common.previous", "Previous")}
              </span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {pages.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-description font-semibold ring-1 ring-inset ring-border text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 text-description font-semibold ring-1 ring-inset ring-border focus:z-20 focus:outline-offset-0 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      : "text-foreground hover:bg-input"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-input focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">{t("common.next", "Next")}</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>

          <div className="flex flex-col items-end relative">
            <div className="flex items-center gap-2">
              <span className="text-description text-muted-foreground">
                {t("common.goTo", "Go to:")}
              </span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPage}
                onChange={handleInputChange}
                onKeyDown={handleJump}
                placeholder="Pg"
                className="w-14 rounded-md border border-border bg-transparent px-2 py-1.5 text-description focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
