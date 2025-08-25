import React from 'react';

interface HeatmapData {
  date: string;
  value: number;
  label?: string;
}

interface HeatmapCalendarProps {
  data: HeatmapData[];
  title: string;
  maxValue?: number;
  colorScheme?: 'blue' | 'green' | 'orange' | 'red';
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  title,
  maxValue,
  colorScheme = 'blue'
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  const getColorIntensity = (value: number) => {
    const intensity = Math.min(value / max, 1);
    
    if (intensity === 0) return 'bg-cloudscape-gray-100';
    
    switch (colorScheme) {
      case 'green':
        if (intensity <= 0.2) return 'bg-cloudscape-green-100';
        if (intensity <= 0.4) return 'bg-cloudscape-green-200';
        if (intensity <= 0.6) return 'bg-cloudscape-green-300';
        if (intensity <= 0.8) return 'bg-cloudscape-green-400';
        return 'bg-cloudscape-green-500';
      case 'orange':
        if (intensity <= 0.2) return 'bg-cloudscape-orange-100';
        if (intensity <= 0.4) return 'bg-cloudscape-orange-200';
        if (intensity <= 0.6) return 'bg-cloudscape-orange-300';
        if (intensity <= 0.8) return 'bg-cloudscape-orange-400';
        return 'bg-cloudscape-orange-500';
      case 'red':
        if (intensity <= 0.2) return 'bg-cloudscape-red-100';
        if (intensity <= 0.4) return 'bg-cloudscape-red-200';
        if (intensity <= 0.6) return 'bg-cloudscape-red-300';
        if (intensity <= 0.8) return 'bg-cloudscape-red-400';
        return 'bg-cloudscape-red-500';
      default: // blue
        if (intensity <= 0.2) return 'bg-cloudscape-blue-100';
        if (intensity <= 0.4) return 'bg-cloudscape-blue-200';
        if (intensity <= 0.6) return 'bg-cloudscape-blue-300';
        if (intensity <= 0.8) return 'bg-cloudscape-blue-400';
        return 'bg-cloudscape-blue-500';
    }
  };

  // Generate weeks for the last 12 weeks
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      
      const week = [];
      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + j);
        
        const dateStr = date.toISOString().split('T')[0];
        const dataPoint = data.find(d => d.date === dateStr);
        
        week.push({
          date: dateStr,
          value: dataPoint?.value || 0,
          label: dataPoint?.label || `${date.toLocaleDateString()}: ${dataPoint?.value || 0}`
        });
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const weeks = generateWeeks();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-cloudscape-bg-primary border border-cloudscape-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-cloudscape-gray-700 mb-4">{title}</h4>
      
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2">
          <div className="h-4 mb-1"></div> {/* Spacer for month labels */}
          {dayLabels.map((day, index) => (
            <div key={day} className="h-3 mb-1 text-xs text-cloudscape-gray-600 flex items-center">
              {index % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1">
          {/* Month labels */}
          <div className="flex mb-1">
            {weeks.map((week, weekIndex) => {
              const firstDay = new Date(week[0].date);
              const isFirstWeekOfMonth = firstDay.getDate() <= 7;
              
              return (
                <div key={weekIndex} className="w-3 mr-1">
                  {isFirstWeekOfMonth && (
                    <div className="text-xs text-cloudscape-gray-600 h-4">
                      {firstDay.toLocaleDateString([], { month: 'short' })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Days grid */}
          <div className="flex flex-col">
            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
              <div key={dayIndex} className="flex mb-1">
                {weeks.map((week, weekIndex) => {
                  const day = week[dayIndex];
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        w-3 h-3 mr-1 rounded-sm cursor-pointer transition-all duration-200
                        hover:ring-2 hover:ring-cloudscape-blue-300
                        ${getColorIntensity(day.value)}
                      `}
                      title={day.label}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-cloudscape-gray-600">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-sm bg-cloudscape-gray-100"></div>
          <div className={`w-3 h-3 rounded-sm ${getColorIntensity(max * 0.2)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColorIntensity(max * 0.4)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColorIntensity(max * 0.6)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColorIntensity(max * 0.8)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColorIntensity(max)}`}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
