export type ScheduleDefinition = {
  displayName: string;
  seconds: number;
};

export const Schedule: { [key: string]: ScheduleDefinition } = {
  TWO_MINUTES: { displayName: "2 Minutes", seconds: 120 },
  FIVE_MINUTES: { displayName: "5 Minutes", seconds: 300 },
  FIFTEEN_MINUTES: { displayName: "15 Minutes", seconds: 900 },
  THIRTY_MINUTES: { displayName: "30 Minutes", seconds: 1800 },
  ONE_HOUR: { displayName: "1 Hour", seconds: 3600 },
  THREE_HOURS: { displayName: "3 Hours", seconds: 10800 },
  SIX_HOURS: { displayName: "6 Hours", seconds: 21600 },
  TWELVE_HOURS: { displayName: "12 Hours", seconds: 43200 },
  DAILY: { displayName: "Daily", seconds: 86400 },
} as const;

export const ScheduleUtils = {
  getDisplayNames(): string[] {
    return Object.values(Schedule).map((s) => s.displayName);
  },

  fromDisplayName(displayName: string): ScheduleDefinition {
    const schedule = Object.values(Schedule).find((s) => s.displayName === displayName);
    if (!schedule) {
      throw new Error(`Invalid schedule display name: ${displayName}`);
    }
    return schedule;
  },

  fromSeconds(seconds: number): ScheduleDefinition {
    const schedule = Object.values(Schedule).find((s) => s.seconds === seconds);
    if (!schedule) {
      throw new Error(`Invalid schedule seconds: ${seconds}`);
    }
    return schedule;
  },
};
