import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { VerificationTier } from '../../types';

interface TrustBadgeProps {
  tier?: VerificationTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  tier = 'tier_0_unverified',
  size = 'sm',
  showLabel = true,
}) => {
  if (tier === 'tier_0_unverified' || !tier) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  if (tier === 'tier_3_enterprise_cargo') {
    return (
      <span
        title="Enterprise Cargo Carrier: CMR, Avia & Logistika litsenziyasi tasdiqlangan"
        className={`inline-flex items-center font-medium rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-sm ${sizeClasses[size]}`}
      >
        <Award className={`${iconSizes[size]} text-emerald-400`} />
        {showLabel && <span>Enterprise Carrier</span>}
      </span>
    );
  }

  if (tier === 'tier_2_business') {
    return (
      <span
        title="Business Verified: Rasmiy yuridik shaxs va soliq raqami tekshirilgan"
        className={`inline-flex items-center font-medium rounded-md bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm ${sizeClasses[size]}`}
      >
        <ShieldCheck className={`${iconSizes[size]} text-amber-400`} />
        {showLabel && <span>Business Verified</span>}
      </span>
    );
  }

  // tier_1_identity
  return (
    <span
      title="Identity Verified: Pasport / ID karta va telefon raqami tasdiqlangan"
      className={`inline-flex items-center font-medium rounded-md bg-blue-950/80 text-blue-300 border border-blue-700/60 shadow-sm ${sizeClasses[size]}`}
    >
      <CheckCircle2 className={`${iconSizes[size]} text-blue-400`} />
      {showLabel && <span>ID Verified</span>}
    </span>
  );
};
