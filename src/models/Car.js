const { v4: uuidv4 } = require('uuid');

class Car {
  constructor({
    id,
    description,
    make,
    model,
    year,
    price,
    carGroup,
    minimumDriverAge,
    availableDates,
    availableLocations,
    availableExtras,
    discounts,
    version,
  }) {
    this.id = id || uuidv4();
    this.description = description;
    this.make = make;
    this.model = model;
    this.year = year;
    this.price = parseFloat(price);
    this.carGroup = carGroup;
    this.minimumDriverAge = parseInt(minimumDriverAge);
    this.availableDates = availableDates.map((date) => new Date(date));
    this.availableLocations = availableLocations;
    this.availableExtras = availableExtras;
    this.discounts = discounts;
    this.version = version || 0;
  }
}
module.exports = Car;
