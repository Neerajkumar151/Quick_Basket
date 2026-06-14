import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  onRetry
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-error/20 rounded-xl bg-error/5">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4 text-error">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-h3 font-bold text-error mb-2">
        {title || t('common.error.title', 'Failed to Load Data')}
      </h3>
      <p className="text-description text-error/80 max-w-sm mb-6">
        {description || t('common.error.description', 'We could not fetch the required data from the server. Please check your connection and try again.')}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-error/50 text-error hover:bg-error/10">
          {t('common.retry', 'Try Again')}
        </Button>
      )}
    </div>
  );
};
