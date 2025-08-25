'use client';

import { useState, useEffect, useTransition } from 'react';
import { Copy, Check, RefreshCw, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockEmails, type Email } from '@/lib/mock-data';
import { checkSpamAction } from '@/lib/actions';
import { EmailItem, type SpamStatus } from '@/components/email-item';
import { Separator } from '@/components/ui/separator';

const generateRandomString = (length: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export default function TempMailClient() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [inbox, setInbox] = useState<Email[]>([]);
  const [spamResults, setSpamResults] = useState<Map<string, SpamStatus>>(new Map());
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [showSpam, setShowSpam] = useState(false);
  const { toast } = useToast();

  const generateNewEmail = () => {
    const newEmail = `${generateRandomString(10)}@tempmail.dev`;
    setCurrentEmail(newEmail);
    setInbox([]);
    setSpamResults(new Map());
  };

  useEffect(() => {
    generateNewEmail();
  }, []);

  useEffect(() => {
    inbox.forEach(email => {
      if (!spamResults.has(email.id)) {
        checkSpamAction(email.body).then(result => {
          setSpamResults(prev => new Map(prev).set(email.id, { ...result, checked: true }));
        });
      }
    });
  }, [inbox, spamResults]);

  const copyToClipboard = () => {
    if (!currentEmail) return;
    navigator.clipboard.writeText(currentEmail).then(() => {
      setIsCopied(true);
      toast({
        title: 'Copied to Clipboard!',
        description: currentEmail,
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const refreshInbox = () => {
    startRefreshTransition(() => {
      const newEmailIndex = inbox.length % mockEmails.length;
      const newEmail = {
        ...mockEmails[newEmailIndex],
        id: `${new Date().getTime()}`,
        timestamp: new Date(),
      };
      setInbox(prev => [newEmail, ...prev]);
    });
  };
  
  const clearInbox = () => {
    setInbox([]);
    setSpamResults(new Map());
    toast({
      title: 'Inbox Cleared',
      description: 'All emails have been removed.',
    });
  };
  
  const filteredInbox = inbox.filter(email => {
    if (showSpam) return true;
    const spamStatus = spamResults.get(email.id);
    return !spamStatus || !spamStatus.isSpam;
  });

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Tempmail</h1>
        <p className="text-muted-foreground mt-2">Your disposable email address solution.</p>
      </header>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Your Temporary Email</CardTitle>
          <CardDescription>Use this address for any temporary sign-ups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input readOnly value={currentEmail} className="text-lg h-12 flex-grow" aria-label="Temporary Email Address"/>
            <Button size="lg" variant="secondary" onClick={copyToClipboard} className="w-full sm:w-32">
              {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              {isCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <Button onClick={generateNewEmail} size="lg" className="w-full">
            <Mail className="mr-2 h-5 w-5" /> Generate New Address
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Emails received will appear here.</CardDescription>
            </div>
             <Button onClick={clearInbox} variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive self-end sm:self-center">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Inbox
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 p-3 bg-card-foreground/5 rounded-lg border">
            <div className="flex items-center space-x-3">
              <Label htmlFor="show-spam" className="cursor-pointer">Show Spam</Label>
              <Switch id="show-spam" checked={showSpam} onCheckedChange={setShowSpam} />
            </div>
            <Button onClick={refreshInbox} variant="outline" disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          <Separator className="my-4" />

          {inbox.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Mail className="mx-auto h-12 w-12" />
              <p className="mt-4 font-semibold">Your inbox is empty.</p>
              <p className="text-sm">Click "Refresh" to check for new emails.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-2">
              {filteredInbox.length > 0 ? filteredInbox.map(email => (
                <EmailItem key={email.id} email={email} spamStatus={spamResults.get(email.id)} />
              )) : (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No non-spam emails to show.</p>
                  <p className="text-sm">Toggle "Show Spam" to see all emails.</p>
                </div>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
