'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  notes?: Array<{ id: string; title: string; createdAt: string; dueDate?: string }>;
}

const CalendarView = ({ selectedDate, onDateSelect, notes = [] }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const notesByDate = notes.reduce((acc, note) => {
    const dateKey = note.dueDate ? format(new Date(note.dueDate), 'yyyy-MM-dd') : format(new Date(note.createdAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  return (
    <div className="calendar bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day: Date) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayNotes = notesByDate[dateKey] || [];
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toISOString()}
              className={`p-2 text-center cursor-pointer rounded ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : isCurrentMonth
                  ? 'hover:bg-gray-100'
                  : 'text-gray-400'
              } ${dayNotes.length > 0 ? 'font-semibold' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="text-sm">{format(day, 'd')}</div>
              {dayNotes.length > 0 && (
                <div className="text-xs mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-1">
            {notesByDate[format(selectedDate, 'yyyy-MM-dd')]?.map((note) => (
              <div key={note.id} className="text-sm text-gray-700">
                • {note.title}
              </div>
            )) || (
              <div className="text-sm text-gray-500">No notes for this date</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { CalendarView };