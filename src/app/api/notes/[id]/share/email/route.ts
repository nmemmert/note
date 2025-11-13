import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, shareUrl, noteTitle, message } = await request.json();
    
    // Check if email is configured
    const emailHost = process.env.EMAIL_SERVER_HOST;
    const emailPort = process.env.EMAIL_SERVER_PORT;
    const emailUser = process.env.EMAIL_SERVER_USER;
    const emailPass = process.env.EMAIL_SERVER_PASSWORD;
    const emailFrom = process.env.EMAIL_FROM || emailUser;
    
    if (!emailHost || !emailPort || !emailUser || !emailPass) {
      console.warn('Email not configured. Please set EMAIL_SERVER_* environment variables.');
      return NextResponse.json({ 
        error: 'Email service not configured. Please contact your administrator.' 
      }, { status: 503 });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: parseInt(emailPort),
      secure: parseInt(emailPort) === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    
    // Email template
    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">📝 ${session.user.name || session.user.email} shared a note with you</h2>
            <p style="color: #4b5563; font-size: 16px;"><strong>Note: "${noteTitle}"</strong></p>
            ${message ? `<div style="background-color: #f3f4f6; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #374151; margin: 0; font-style: italic;">"${message}"</p>
            </div>` : ''}
            <div style="margin: 30px 0; text-align: center;">
              <a href="${shareUrl}" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                📖 View Shared Note
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This note was shared from NoteMaster. Click the button above to view it in your browser.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px;">
              Sent via <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="color: #3b82f6; text-decoration: none;">NoteMaster</a>
            </p>
          </div>
        </body>
      </html>
    `;
    
    // Send email
    await transporter.sendMail({
      from: `"${session.user.name || 'NoteMaster'}" <${emailFrom}>`,
      to: email,
      subject: `📝 ${session.user.name || session.user.email} shared a note with you`,
      html: emailBody,
    });
    
    console.log('Email invitation sent to:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Email invitation sent successfully',
    });
  } catch (error) {
    console.error('Error sending email invitation:', error);
    return NextResponse.json({ 
      error: 'Failed to send email. Please try again or contact support.' 
    }, { status: 500 });
  }
}
