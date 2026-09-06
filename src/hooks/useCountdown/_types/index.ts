export interface CountdownUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Countdown extends CountdownUnits {
  isComplete: boolean;
}

export interface Params {
  targetDate: Date | string;
}

export type CountdownTimeZone = 'local' | 'GMT' | 'KST';

export interface Options {
  timeZone?: CountdownTimeZone;
}
