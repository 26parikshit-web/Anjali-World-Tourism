export function getSpotsRemaining(groupTrip) {
  const max = Number(groupTrip?.max_capacity) || 0;
  const booked = Number(groupTrip?.spots_booked) || 0;
  return Math.max(0, max - booked);
}

export function isGroupTripFull(groupTrip) {
  return getSpotsRemaining(groupTrip) <= 0;
}

export function canAccommodatePax(groupTrip, pax) {
  const travelers = Math.round(Number(pax) || 0);
  if (travelers < 1) return false;
  return travelers <= getSpotsRemaining(groupTrip);
}

export function capacityLabel(groupTrip) {
  const remaining = getSpotsRemaining(groupTrip);
  const max = Number(groupTrip?.max_capacity) || 0;
  const booked = Number(groupTrip?.spots_booked) || 0;
  return {
    remaining,
    max,
    booked,
    isFull: remaining <= 0,
    label: remaining <= 0 ? "Fully booked" : `${remaining} of ${max} spots left`,
  };
}
