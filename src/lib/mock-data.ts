export type Email = {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
};

export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'hello@tempmail.dev',
    subject: 'Welcome to Tempmail!',
    body: 'This is a sample email. You can view your received emails here. Feel free to generate a new address anytime.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    from: 'security@webapp.com',
    subject: 'Your account security',
    body: 'We noticed a new login. If this was you, you can safely ignore this message.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    from: 'offers@spam-central.com',
    subject: 'URGENT: Your exclusive prize is waiting!',
    body: 'Congratulations! You have been selected to win a free vacation. Click here to claim your prize now! This is a limited time offer, do not miss out on this amazing opportunity. We have tried to contact you multiple times.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '4',
    from: 'newsletter@tech-today.com',
    subject: 'Weekly Tech Digest',
    body: 'Here are the top stories in tech this week. Read about the latest advancements in AI, blockchain, and more.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '5',
    from: 'support@service.com',
    subject: 'Re: Your support ticket',
    body: 'We have resolved your issue. Please let us know if you need further assistance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '6',
    from: 'sales@cheapstuff.com',
    subject: 'You have won a lottery!',
    body: 'Dear winner, you have won $1,000,000. Please provide your bank details to receive the prize. This is not a scam, trust us.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
  }
];
