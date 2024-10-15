export interface Performance {
  id: string;
  name: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
}

export interface Venue {
  id: string;
  name: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayData {
  date: Date;
  performances: Performance[];
}