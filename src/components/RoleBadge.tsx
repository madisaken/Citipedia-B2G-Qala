import React from 'react';
import { Shield, Pencil, User as UserIcon, Settings } from 'lucide-react';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { useApp } from '../context';
import { cn } from '../utils';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
  showLabel?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className, showLabel = true }) => {
  const { language } = useApp();
  const t = TRANSLATIONS[language];

  const config = {
    steward: {
      icon: Shield,
      label: t.stewardRole,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    owner: {
      icon: Pencil,
      label: t.ownerRole,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    analyst: {
      icon: UserIcon,
      label: t.analystRole,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    admin: {
      icon: Settings,
      label: t.adminRole,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
  };

  const { icon: Icon, label, color } = config[role];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wider",
      color,
      className
    )}>
      <Icon size={10} />
      {showLabel && <span>{label}</span>}
    </div>
  );
};
