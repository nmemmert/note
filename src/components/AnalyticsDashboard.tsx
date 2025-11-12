'use client';

interface AnalyticsDashboardProps {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }>;
  onClose: () => void;
}

export default function AnalyticsDashboard({ notes, onClose }: AnalyticsDashboardProps) {
  // Calculate statistics
  const totalNotes = notes.length;
  const totalWords = notes.reduce((sum, note) => {
    const text = note.content.replace(/<[^>]*>/g, '');
    return sum + text.split(/\s+/).filter(w => w.length > 0).length;
  }, 0);

  // Tag frequency
  const tagFrequency = notes.reduce((acc, note) => {
    note.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // Notes per month (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  }).reverse();

  const notesPerMonth = last6Months.map(month => {
    const count = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.getMonth() === month.getMonth() && 
             noteDate.getFullYear() === month.getFullYear();
    }).length;
    return {
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count
    };
  });

  // Recent activity (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const activityLast7Days = last7Days.map(day => {
    const count = notes.filter(note => {
      const noteDate = new Date(note.updatedAt);
      return noteDate.toDateString() === day.toDateString();
    }).length;
    return {
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      count
    };
  });

  const maxActivity = Math.max(...activityLast7Days.map(d => d.count), 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">📊 Analytics Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-3xl font-bold text-blue-900">{totalNotes}</div>
              <div className="text-sm text-blue-700">Total Notes</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="text-3xl mb-2">✍️</div>
              <div className="text-3xl font-bold text-green-900">{totalWords.toLocaleString()}</div>
              <div className="text-sm text-green-700">Total Words</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="text-3xl font-bold text-purple-900">{Object.keys(tagFrequency).length}</div>
              <div className="text-sm text-purple-700">Unique Tags</div>
            </div>
          </div>

          {/* Activity Heatmap - Last 7 Days */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activity (Last 7 Days)</h3>
            <div className="grid grid-cols-7 gap-2">
              {activityLast7Days.map((item, i) => (
                <div key={i} className="text-center">
                  <div
                    className="rounded-lg mb-2 transition-all hover:scale-105"
                    style={{
                      height: `${Math.max(40, (item.count / maxActivity) * 100)}px`,
                      backgroundColor: item.count > 0 
                        ? `rgba(59, 130, 246, ${0.2 + (item.count / maxActivity) * 0.8})`
                        : '#f3f4f6'
                    }}
                  />
                  <div className="text-xs text-gray-600">{item.day}</div>
                  <div className="text-xs font-bold text-gray-900">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Per Month */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notes Created (Last 6 Months)</h3>
            <div className="space-y-3">
              {notesPerMonth.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600">{item.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all flex items-center px-3"
                      style={{ width: `${Math.max((item.count / Math.max(...notesPerMonth.map(m => m.count), 1)) * 100, 5)}%` }}
                    >
                      <span className="text-white font-bold text-sm">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Tags */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Tags</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sortedTags.map(([tag, count]) => (
                <div key={tag} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 truncate">#{tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
