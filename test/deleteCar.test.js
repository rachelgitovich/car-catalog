const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('DELETE /api/cars/:id', () => {
  it('should delete a car from the catalog', (done) => {
    const newCar = {
      description: 'KIA Sportage car',
      make: 'KIA',
      model: 'Sportage',
      year: '2023',
      price: '400',
      carGroup: 'SUV',
      minimumDriverAge: '22',
      availableDates: [
        '2023-10-15',
        '2023-10-16',
        '2023-10-17',
        '2023-10-18',
        '2023-10-19',
      ],
      availableLocations: ['Tel-Aviv'],
      availableExtras: [],
      discounts: 'none',
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

        chai
          .request(app)
          .delete(`/api/cars/${carId}`)
          .end((err, res) => {
            try {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property(
                'message',
                'Car removed from the catalog'
              );

              // After deletion, check that the car no longer exists in the catalog
              chai
                .request(app)
                .get('/api/cars')
                .end((err, res) => {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('array');
                  const deletedCar = res.body.find((car) => car.id === carId);
                  expect(deletedCar).to.be.undefined;
                  done();
                });
            } catch (error) {
              done(error);
            }
          });
      });
  });

  it('should return a 404 error when deleting a non-existent car', (done) => {
    const nonExistentCarId = 'nonexistentcarid';

    chai
      .request(app)
      .delete(`/api/cars/${nonExistentCarId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'Car not found');
        done();
      });
  });
});
