import React from "react";
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { SalesDashboard } from './SalesDashboard';
import { RevenueReports } from './RevenueReports';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 'sales', label: t('reports.tabs.sales'), content: <div className="p-6"><SalesDashboard /></div> },
    { id: 'revenue', label: t('reports.tabs.revenue'), content: <div className="p-6"><RevenueReports /></div> }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title={t('reports.header.title')}
        description={t('reports.header.subtitle')}
      />

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Tabs 
          tabs={tabs} 
          className="border-b border-border bg-muted/20"
        />
      </div>
    </div>
  );
};
