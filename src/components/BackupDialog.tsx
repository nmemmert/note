'use client';

import { useState } from 'react';

interface BackupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBackup: () => void;
  onRestore: (file: File) => void;
}

const BackupDialog = ({ isOpen, onClose, onBackup, onRestore }: BackupDialogProps) => {
  const [restoreFile, setRestoreFile] = useState<File | null>(null);

  const handleRestore = () => {
    if (restoreFile) {
      onRestore(restoreFile);
      setRestoreFile(null);
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRestoreFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Backup & Restore</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Create Backup</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download all your notes as a JSON file for safekeeping.
            </p>
            <button
              onClick={onBackup}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Download Backup
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Restore from Backup</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a previously created backup file to restore your notes.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="w-full mb-3"
            />
            <button
              onClick={handleRestore}
              disabled={!restoreFile}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Restore from File
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export { BackupDialog };