import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123') {
    console.log('--- MOCK EMAIL ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Content:', html);
    console.log('------------------');
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Wivoo Taskboard <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
