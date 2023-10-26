const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const allDatesAvailable = (availableDates, allDates) => {
  return allDates.every((date) =>
    availableDates.some(
      (availableDate) => date.getTime() === availableDate.getTime()
    )
  );
};

const isValidCar = (car) => {
  if (
    !car.description ||
    !car.make ||
    !car.model ||
    !car.year ||
    isNaN(car.price) ||
    !car.carGroup ||
    isNaN(car.minimumDriverAge) ||
    !Array.isArray(car.availableDates) ||
    !Array.isArray(car.availableLocations) ||
    !Array.isArray(car.availableExtras) ||
    typeof car.discounts !== 'string'
  ) {
    return false;
  }

  return true;
};

module.exports = { getDatesBetween, allDatesAvailable, isValidCar };
