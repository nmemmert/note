'use client';

import { useState } from 'react';

interface ShareDialogProps {
  noteId: string;
  noteTitle: string;
  onClose: () => void;
}

export default function ShareDialog({ noteId, noteTitle, onClose }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresIn }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
      } else {
        alert('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendEmailInvitation = async () => {
    if (!email || !shareUrl) return;

    setSendingEmail(true);
    try {
      const response = await fetch(`/api/notes/${noteId}/share/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          shareUrl,
          noteTitle,
          message: emailMessage,
        }),
      });

      if (response.ok) {
        alert('Email invitation sent successfully!');
        setEmail('');
        setEmailMessage('');
      } else {
        alert('Failed to send email invitation');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email invitation');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🔗 Share "{noteTitle}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Generate Link Section */}
          {!shareUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link Expiration (optional)
                </label>
                <select
                  value={expiresIn || ''}
                  onChange={(e) => setExpiresIn(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Never expires</option>
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>

              <button
                onClick={generateShareLink}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : '🔗 Generate Share Link'}
              </button>
            </div>
          ) : (
            <>
              {/* Share Link Display */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Anyone with this link can view this note{expiresIn ? ` for ${expiresIn} days` : ' forever'}.
                </p>
              </div>

              {/* Email Invitation Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  📧 Send via Email
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personal Message (optional)
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={sendEmailInvitation}
                  disabled={!email || sendingEmail}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingEmail ? 'Sending...' : '📧 Send Email Invitation'}
                </button>
              </div>

              {/* Generate New Link */}
              <button
                onClick={() => {
                  setShareUrl(null);
                  setCopied(false);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Generate New Link
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
