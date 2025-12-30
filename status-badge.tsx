import { Badge } from './badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'kept' | 'broken';
  count?: number;
  className?: string;
}

export function StatusBadge({ status, count, className }: StatusBadgeProps) {
  const isKept = status === 'kept';
  
  return (
    <Badge 
      className={cn(
        'text-white border-0 rounded-xl px-4 py-1.5 shadow-md',
        isKept 
          ? 'bg-gradient-to-r from-vow-kept to-vow-kept-dark'
          : 'bg-gradient-to-r from-vow-broken to-vow-broken-dark',
        className
      )}
    >
      {isKept ? <Check className="w-4 h-4 mr-1.5" /> : <X className="w-4 h-4 mr-1.5" />}
      {count !== undefined && count}
    </Badge>
  );
}
