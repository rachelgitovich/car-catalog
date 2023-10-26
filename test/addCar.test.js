const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('POST /api/cars', () => {
  it('should add a car to the catalog and then delete it', (done) => {
    const newCar = {
      description: 'New Toyota Corolla!',
      make: 'Toyota',
      model: 'Corolla',
      year: '2023',
      price: '350',
      carGroup: 'Sedan',
      minimumDriverAge: '21',
      availableDates: [
        '2023-10-15',
        '2023-10-16',
        '2023-10-17',
        '2023-10-18',
        '2023-10-19',
      ],
      availableLocations: ['Tel-Aviv', 'Jerusalem'],
      availableExtras: ['GPS', 'Disk player'],
      discounts: '20%',
    };

    // Add the new car
    chai
      .request(app)
      .post('/api/cars')
      .send(newCar)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property(
          'message',
          'Car added to the catalog'
        );
        const carId = res.body.car.id;

        // Delete the car
        chai
          .request(app)
          .delete(`/api/cars/${carId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property(
              'message',
              'Car removed from the catalog'
            );
            done();
          });
      });
  });

  it('should return validation errors for incomplete car data', (done) => {
    const invalidCarData = {
      invalid: 'data',
    };

    chai
      .request(app)
      .post('/api/cars')
      .send(invalidCarData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message', 'Invalid car data');
        done();
      });
  });
});
