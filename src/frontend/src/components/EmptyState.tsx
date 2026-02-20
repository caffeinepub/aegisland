import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted/50 p-4 transition-all duration-300 hover:scale-110">
          <Icon className="h-8 w-8 text-muted-foreground/70" />
        </div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            className="transition-all duration-200 hover:shadow-md active:scale-95"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
