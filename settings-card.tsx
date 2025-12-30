import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { IconContainer } from './icon-container';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  icon: LucideIcon;
  iconVariant?: 'primary' | 'kept' | 'broken' | 'antidote' | 'admin' | 'secondary';
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsCard({
  icon,
  iconVariant = 'primary',
  title,
  description,
  children
}: SettingsCardProps) {
  return (
    <Card className="card-base">
      <CardHeader>
        <div className="flex items-center gap-3">
          <IconContainer icon={icon} variant={iconVariant} />
          <div>
            <CardTitle className="text-vow-text-primary">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
