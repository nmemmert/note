'use client';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#171717',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      accent: '#10b981',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accent: '#34d399',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    colors: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      background: '#2e3440',
      surface: '#3b4252',
      text: '#eceff4',
      textSecondary: '#d8dee9',
      border: '#4c566a',
      accent: '#a3be8c',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    colors: {
      primary: '#268bd2',
      secondary: '#6c71c4',
      background: '#fdf6e3',
      surface: '#eee8d5',
      text: '#657b83',
      textSecondary: '#93a1a1',
      border: '#d3cbb8',
      accent: '#859900',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      primary: '#bd93f9',
      secondary: '#ff79c6',
      background: '#282a36',
      surface: '#44475a',
      text: '#f8f8f2',
      textSecondary: '#6272a4',
      border: '#6272a4',
      accent: '#50fa7b',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    colors: {
      primary: '#66d9ef',
      secondary: '#ae81ff',
      background: '#272822',
      surface: '#3e3d32',
      text: '#f8f8f2',
      textSecondary: '#75715e',
      border: '#49483e',
      accent: '#a6e22e',
    },
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  onClose: () => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Choose Theme</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                currentTheme === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-3 font-semibold text-gray-900">{theme.name}</div>
              <div className="grid grid-cols-4 gap-2">
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.colors.background }}
                  title="Background"
                />
                <div
                  className="h-8 rounded"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
              </div>
              {currentTheme === theme.id && (
                <div className="mt-2 text-sm text-blue-600 font-medium">✓ Active</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function applyTheme(themeId: string) {
  const theme = themes.find(t => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Update body background
  document.body.style.backgroundColor = theme.colors.background;
  document.body.style.color = theme.colors.text;
}
