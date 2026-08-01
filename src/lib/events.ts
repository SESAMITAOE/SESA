import type { EventItem, EventStatus } from "@/types";

const statusOrder: Record<EventStatus, number> = {
  completed: 0,
  live: 1,
  upcoming: 2,
  planned: 3,
};

function eventTimestamp(event: EventItem) {
  if (!event.startAt) {
    return Number.MAX_SAFE_INTEGER;
  }

  const timestamp = new Date(event.startAt).getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

export function sortEventsForJourney(events: EventItem[]) {
  return [...events].sort((first, second) => {
    const statusDifference =
      statusOrder[first.status] - statusOrder[second.status];
    if (statusDifference !== 0) {
      return statusDifference;
    }

    const orderDifference =
      (first.displayOrder ?? Number.MAX_SAFE_INTEGER) -
      (second.displayOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDifference !== 0) {
      return orderDifference;
    }

    const dateDifference = eventTimestamp(first) - eventTimestamp(second);
    return dateDifference || first.title.localeCompare(second.title);
  });
}
