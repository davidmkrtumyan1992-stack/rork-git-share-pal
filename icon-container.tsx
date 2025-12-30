import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface IconContainerProps {
  icon: LucideIcon;
  variant?: 'primary' | 'kept' | 'broken' | 'antidote' | 'admin' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  primary: 'bg-gradient-to-br from-vow-primary to-vow-primary-dark',
  kept: 'bg-gradient-to-br from-vow-kept to-vow-kept-dark',
  broken: 'bg-gradient-to-br from-vow-broken to-vow-broken-dark',
  antidote: 'bg-gradient-to-br from-vow-antidote to-vow-antidote-dark',
  admin: 'bg-gradient-to-br from-[#FF6347] to-[#FF4500]',
  secondary: 'bg-gradient-to-br from-[#A67C5C] to-[#8B6A4E]',
};

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconSizes = {
  sm: 20,
  md: 24,
  lg: 32,
};

export function IconContainer({ 
  icon: Icon, 
  variant = 'primary', 
  size = 'md',
  className 
}: IconContainerProps) {
  return (
    <div className={cn(
      'rounded-2xl flex items-center justify-center shadow-md',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <Icon className="text-white" size={iconSizes[size]} />
    </div>
  );
}
