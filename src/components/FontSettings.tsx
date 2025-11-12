'use client';

import { useState, useEffect } from 'react';

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

interface FontSettingsProps {
  currentSettings: FontSettings;
  onSettingsChange: (settings: FontSettings) => void;
  onClose: () => void;
}

const fontFamilies = [
  { name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', preview: 'Aa' },
  { name: 'Inter', value: 'Inter, sans-serif', preview: 'Aa' },
  { name: 'Georgia', value: 'Georgia, serif', preview: 'Aa' },
  { name: 'Times New Roman', value: '"Times New Roman", serif', preview: 'Aa' },
  { name: 'Courier New', value: '"Courier New", monospace', preview: 'Aa' },
  { name: 'Monaco', value: 'Monaco, Consolas, monospace', preview: 'Aa' },
  { name: 'Comic Sans', value: '"Comic Sans MS", cursive', preview: 'Aa' },
  { name: 'Roboto', value: 'Roboto, sans-serif', preview: 'Aa' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif', preview: 'Aa' },
  { name: 'Lato', value: 'Lato, sans-serif', preview: 'Aa' },
  { name: 'Merriweather', value: 'Merriweather, serif', preview: 'Aa' },
  { name: 'Playfair Display', value: '"Playfair Display", serif', preview: 'Aa' },
];

export default function FontSettingsDialog({ currentSettings, onSettingsChange, onClose }: FontSettingsProps) {
  const [settings, setSettings] = useState<FontSettings>(currentSettings);
  const [previewText, setPreviewText] = useState(
    'The quick brown fox jumps over the lazy dog. 0123456789'
  );

  const updateSetting = (key: keyof FontSettings, value: string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const applySettings = () => {
    onSettingsChange(settings);
    onClose();
  };

  const resetToDefaults = () => {
    const defaults: FontSettings = {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
    };
    setSettings(defaults);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">🔤 Font Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Preview Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div
              className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50"
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
            >
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-900"
                placeholder="Type to preview..."
              />
            </div>
          </div>

          {/* Font Family */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Font Family</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  onClick={() => updateSetting('fontFamily', font.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    settings.fontFamily === font.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="text-2xl mb-1"
                    style={{ fontFamily: font.value }}
                  >
                    {font.preview}
                  </div>
                  <div className="text-xs text-gray-600">{font.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size: {settings.fontSize}px
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  -
                </button>
                <button
                  onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small (12px)</span>
              <span>Medium (16px)</span>
              <span>Large (24px)</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Line Height: {settings.lineHeight}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1.2"
                max="2.0"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('lineHeight', Math.max(1.2, settings.lineHeight - 0.1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  -
                </button>
                <button
                  onClick={() => updateSetting('lineHeight', Math.min(2.0, settings.lineHeight + 0.1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Tight (1.2)</span>
              <span>Normal (1.6)</span>
              <span>Loose (2.0)</span>
            </div>
          </div>

          {/* Sample Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sample Text</label>
            <div
              className="p-4 border border-gray-200 rounded-lg bg-white"
              style={{
                fontFamily: settings.fontFamily,
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
              }}
            >
              <h3 className="font-bold mb-2">Heading Example</h3>
              <p className="mb-2">
                This is a sample paragraph to demonstrate how your notes will look with these font settings.
                You can adjust the font family, size, and line height to match your preferences.
              </p>
              <ul className="list-disc list-inside mb-2">
                <li>Bullet point one</li>
                <li>Bullet point two</li>
                <li>Bullet point three</li>
              </ul>
              <p className="text-sm text-gray-600">
                Small text example: Perfect for annotations and metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applySettings}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
