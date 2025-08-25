'use client';

import type { Email } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDistanceToNow } from 'date-fns';

export type SpamStatus = {
  isSpam: boolean;
  spamReason?: string;
  checked: boolean;
};

type EmailItemProps = {
  email: Email;
  spamStatus?: SpamStatus;
};

export function EmailItem({ email, spamStatus }: EmailItemProps) {
  const timeAgo = formatDistanceToNow(new Date(email.timestamp), { addSuffix: true });

  return (
    <AccordionItem value={email.id} className="border rounded-lg overflow-hidden transition-all hover:shadow-md bg-card">
      <AccordionTrigger className="p-4 hover:bg-muted/50 hover:no-underline data-[state=open]:bg-muted/50">
        <div className="flex items-start justify-between gap-4 w-full text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold truncate text-sm">{email.from}</p>
              {!spamStatus?.checked ? (
                <Skeleton className="h-5 w-12 rounded-full" />
              ) : (
                spamStatus.isSpam && (
                  <Badge variant="destructive" className="text-xs flex-shrink-0">
                    Spam
                  </Badge>
                )
              )}
            </div>
            <p className="text-base font-medium truncate">{email.subject}</p>
          </div>
          <p className="text-xs text-muted-foreground flex-shrink-0">
            {timeAgo}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 pt-0">
         <div className="border-t pt-4">
             <p className="whitespace-pre-wrap text-sm text-muted-foreground">{email.body}</p>
             {spamStatus?.isSpam && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm font-semibold text-destructive">AI Spam Analysis</p>
                <p className="text-xs text-destructive/80 mt-1">
                  {spamStatus.spamReason || 'This email was identified as spam based on its content.'}
                </p>
              </div>
            )}
         </div>
      </AccordionContent>
    </AccordionItem>
  );
}
