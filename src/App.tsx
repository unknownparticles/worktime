/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
  startOfDay
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Briefcase,
  Info,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getShiftStatus, type ShiftConfig } from './lib/utils';

export default function App() {
  // Persistence using localStorage
  const [config, setConfig] = useState<ShiftConfig>(() => {
    const saved = localStorage.getItem('shift-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startDate: new Date(parsed.startDate)
      };
    }
    return {
      workDays: 4,
      restDays: 2,
      startDate: startOfDay(new Date())
    };
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('shift-config', JSON.stringify(config));
  }, [config]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const today = startOfDay(new Date());
  const todayStatus = getShiftStatus(today, config);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 text-white p-2 rounded-lg">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight">ShiftEase</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium font-sans">我的排班助手</p>
          </div>
        </div>
        <button 
          id="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-600"
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Today Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative overflow-hidden rounded-3xl p-6 shadow-xl shadow-zinc-200",
            todayStatus === 'work' ? "bg-red-500 text-white" : "bg-green-500 text-white"
          )}
        >
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                {format(today, 'yyyy年M月d日 EEEE', { locale: zhCN })}
              </p>
              <h2 className="text-4xl font-serif font-black tracking-tight">
                今天是{todayStatus === 'work' ? '上班日' : '休息日'}
              </h2>
              <p className="mt-2 text-white/70 text-sm flex items-center gap-1">
                <Info size={14} />
                当前周期：{config.workDays}上{config.restDays}休
              </p>
            </div>
            <div className="opacity-20">
              {todayStatus === 'work' ? <Briefcase size={64} /> : <Coffee size={64} />}
            </div>
          </div>
          {/* Decorative Background Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        {/* Calendar Section */}
        <section className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h3 className="text-lg font-serif font-bold text-zinc-800">
                {format(currentMonth, 'yyyy年 MMMM', { locale: zhCN })}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400">
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={goToToday}
                className="px-3 py-1 text-xs font-semibold bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors"
              >
                今天
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-[2px] bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {days.map((day, idx) => {
              const status = getShiftStatus(day, config);
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div 
                  key={idx}
                  className={cn(
                    "aspect-square relative flex flex-col items-center justify-center transition-all duration-300 group cursor-default p-1",
                    !isCurrentMonth ? "bg-zinc-50/30 opacity-40" : (
                      status === 'work' 
                        ? "bg-red-50" 
                        : "bg-green-50"
                    )
                  )}
                >
                  {/* Status Indicator Bar */}
                  <div className={cn(
                    "absolute top-0 inset-x-0 h-1",
                    status === 'work' ? "bg-red-200" : "bg-green-200"
                  )} />

                  <span className={cn(
                    "text-sm font-bold z-10 transition-colors",
                    !isCurrentMonth ? "text-zinc-300" : (
                      status === 'work' ? "text-red-700" : "text-green-700"
                    ),
                    isToday && "text-white!"
                  )}>
                    {format(day, 'd')}
                  </span>

                  <span className={cn(
                    "text-[8px] font-bold mt-0.5 z-10",
                    !isCurrentMonth ? "hidden" : "block",
                    status === 'work' ? "text-red-400" : "text-green-400",
                    isToday && "text-white/80!"
                  )}>
                    {status === 'work' ? '班' : '休'}
                  </span>

                  {/* Today Highlight */}
                  {isToday && (
                    <motion.div 
                      layoutId="today-highlight"
                      className="absolute inset-1.5 bg-zinc-900 rounded-lg -z-0 shadow-lg"
                    />
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex gap-4 px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">上班</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">休息</span>
            </div>
          </div>
        </section>
      </main>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-[40px] p-8 shadow-2xl border-t border-zinc-100 max-w-md mx-auto"
            >
              <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-8" />
              
              <h3 className="text-2xl font-serif font-black mb-6 text-zinc-800 flex items-center gap-2">
                <SettingsIcon className="text-zinc-400" />
                排班设置
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">排班周期</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs text-zinc-500">上班天数</span>
                      <input 
                        type="number" 
                        min="1"
                        value={config.workDays}
                        onChange={(e) => setConfig({ ...config, workDays: parseInt(e.target.value) || 1 })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs text-zinc-500">休息天数</span>
                      <input 
                        type="number" 
                        min="0"
                        value={config.restDays}
                        onChange={(e) => setConfig({ ...config, restDays: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">起始日期 (上班第一天)</label>
                  <input 
                    type="date" 
                    value={format(config.startDate, 'yyyy-MM-dd')}
                    onChange={(e) => setConfig({ ...config, startDate: startOfDay(new Date(e.target.value)) })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                  />
                  <p className="mt-2 text-[10px] text-zinc-400 leading-relaxed italic">
                    提示：设置您最近一次排班周期开始的第一天，系统将以此为锚点计算所有日期的状态。
                  </p>
                </div>

                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                >
                  完 成
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
