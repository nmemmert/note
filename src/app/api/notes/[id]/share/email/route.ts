import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, shareUrl, noteTitle, message } = await request.json();
    
    // In production, use a real email service like SendGrid, AWS SES, or Nodemailer
    // For now, we'll just log it and return success
    console.log('Email invitation:', {
      to: email,
      from: session.user.email,
      shareUrl,
      noteTitle,
      message,
    });
    
    // Mock email template
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>📝 ${session.user.name || session.user.email} shared a note with you</h2>
          <p><strong>Note: "${noteTitle}"</strong></p>
          ${message ? `<p><em>"${message}"</em></p>` : ''}
          <div style="margin: 30px 0;">
            <a href="${shareUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              📖 View Shared Note
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This note was shared from NoteMaster. Click the button above to view it.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Sent via <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="color: #3b82f6;">NoteMaster</a>
          </p>
        </body>
      </html>
    `;
    
    // TODO: Integrate with actual email service
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({
    //   from: process.env.EMAIL_FROM,
    //   to: email,
    //   subject: `${session.user.name || session.user.email} shared a note with you`,
    //   html: emailBody,
    // });
    
    return NextResponse.json({
      success: true,
      message: 'Email invitation sent',
    });
  } catch (error) {
    console.error('Error sending email invitation:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
