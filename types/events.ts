export type Event = {
  id: number;
  name: string;
  date: string;
  flyer: string | null;
  location: string;
};

export type EventResponse = {
  result: Event[];
};
