import React from "react";
import en from "../../locales/en.json";

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-6 border-t border-border mt-auto">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">{en.layout.privacy}</a>
          <a href="#" className="hover:text-foreground transition-colors">{en.layout.terms}</a>
        </div>
        <span>{en.layout.copyright}</span>
      </div>
    </footer>
  );
};
