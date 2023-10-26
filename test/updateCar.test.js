const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('PUT /api/cars/:id', () => {
  it('should update a car in the catalog and then delete it', (done) => {
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

        const updatedCar = {
          description: 'New Toyota Corolla!',
          make: 'Toyota',
          model: 'Corolla',
          year: '2023',
          price: '380',
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
          discounts: 'none',
          version: res.body.car.version,
        };

        // Update the car
        chai
          .request(app)
          .put(`/api/cars/${carId}`)
          .send(updatedCar)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Car listing updated');
            expect(res.body).to.have.property('car');
            expect(res.body.car).to.have.property('price', 380);

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
  });
});
