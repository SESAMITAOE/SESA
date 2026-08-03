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

function displayOrder(event: EventItem) {
  return event.displayOrder ?? Number.MAX_SAFE_INTEGER;
}

function compareDisplayOrder(first: EventItem, second: EventItem) {
  return displayOrder(first) - displayOrder(second);
}

export function sortEventsForJourney(events: EventItem[]) {
  return [...events].sort((first, second) => {
    const statusDifference =
      statusOrder[first.status] - statusOrder[second.status];
    if (statusDifference !== 0) {
      return statusDifference;
    }

    const firstTimestamp = eventTimestamp(first);
    const secondTimestamp = eventTimestamp(second);

    // Dated programme phases remain chronological. The CMS display order is a
    // stable tie-breaker and remains primary for undated/planned content.
    if (
      first.status !== "planned" &&
      firstTimestamp !== secondTimestamp
    ) {
      return firstTimestamp - secondTimestamp;
    }

    return (
      compareDisplayOrder(first, second) || first.title.localeCompare(second.title)
    );
  });
}

export function getNextFutureEventId(
  events: EventItem[],
  referenceTime: string | number | Date,
) {
  if (events.some((event) => event.status === "live")) {
    return undefined;
  }

  const referenceTimestamp = new Date(referenceTime).getTime();
  if (Number.isNaN(referenceTimestamp)) {
    return undefined;
  }

  return events
    .filter((event) => {
      if (event.status !== "upcoming" && event.status !== "planned") {
        return false;
      }

      if (!event.startAt) {
        return false;
      }

      const timestamp = new Date(event.startAt).getTime();
      return !Number.isNaN(timestamp) && timestamp > referenceTimestamp;
    })
    .sort(
      (first, second) =>
        eventTimestamp(first) - eventTimestamp(second) ||
        compareDisplayOrder(first, second) ||
        first.title.localeCompare(second.title),
    )[0]?.id;
}
