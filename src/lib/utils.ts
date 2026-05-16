import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInDays, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ShiftConfig {
  workDays: number;
  restDays: number;
  startDate: Date;
}

export function getShiftStatus(date: Date, config: ShiftConfig): 'work' | 'rest' {
  const current = startOfDay(date);
  const anchor = startOfDay(config.startDate);
  const diff = differenceInDays(current, anchor);
  
  if (diff < 0) {
    // For dates before start date, we cycle backwards
    const cycle = config.workDays + config.restDays;
    const offset = (diff % cycle + cycle) % cycle;
    return offset < config.workDays ? 'work' : 'rest';
  }

  const cycle = config.workDays + config.restDays;
  const dayInCycle = diff % cycle;

  return dayInCycle < config.workDays ? 'work' : 'rest';
}
