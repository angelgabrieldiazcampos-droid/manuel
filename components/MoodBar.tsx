import React from 'react';

interface MoodBarProps {
  mood: number;
}

const moodLevels: Record<number, { text: string; color: string; width: string }> = {
  5: { text: 'Excelente', color: 'bg-green-500', width: '100%' },
  4: { text: 'Bien', color: 'bg-lime-500', width: '80%' },
  3: { text: 'Serio', color: 'bg-yellow-500', width: '60%' },
  2: { text: 'Molesto', color: 'bg-orange-500', width: '40%' },
  1: { text: 'Furioso', color: 'bg-red-600', width: '20%' },
};

export const MoodBar: React.FC<MoodBarProps> = ({ mood }) => {
  const currentMood = moodLevels[mood] || moodLevels[3];

  return (
    <div className="p-2 bg-gray-200 border-b border-gray-300">
      <div className="w-full bg-gray-300 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${currentMood.color}`}
          style={{ width: currentMood.width }}
        />
      </div>
      <p className="text-center text-sm font-semibold mt-1 text-gray-700">
        Estado de Ánimo: {currentMood.text}
      </p>
    </div>
  );
};
