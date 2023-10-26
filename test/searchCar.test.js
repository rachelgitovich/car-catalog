const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /api/cars/search', () => {
  before((done) => {
    const firstCar = {
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
      .send(firstCar)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property(
          'message',
          'Car added to the catalog'
        );

        const secondCar = {
          description: 'Newset Tesla!',
          make: 'Tesla',
          model: '3',
          year: '2023',
          price: '500',
          carGroup: 'Sedan',
          minimumDriverAge: '25',
          availableDates: [
            '2023-10-17',
            '2023-10-18',
            '2023-10-19',
            '2023-10-20',
            '2023-10-28',
            '2023-10-29',
          ],
          availableLocations: ['Tel-Aviv'],
          availableExtras: ['GPS', 'Disk Player'],
          discounts: 'none',
        };

        chai
          .request(app)
          .post('/api/cars')
          .send(secondCar)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property(
              'message',
              'Car added to the catalog'
            );
            done();
          });
      });
  });

  it('should return a list of cars that match search criteria', (done) => {
    const query = {
      startDate: '2023-10-17',
      endDate: '2023-10-19',
      location: 'Tel-Aviv',
      ageGroup: 25,
      carGroup: 'Sedan',
    };

    chai
      .request(app)
      .get('/api/cars/search')
      .query(query)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('results');
        expect(res.body.results).to.be.an('array').with.lengthOf(2);
        done();
      });
  });

  it('should return one car that matches search criteria', (done) => {
    const query = {
      startDate: '2023-10-15',
      endDate: '2023-10-17',
      location: 'Jerusalem',
      ageGroup: 25,
      carGroup: 'Sedan',
    };

    chai
      .request(app)
      .get('/api/cars/search')
      .query(query)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('results');
        expect(res.body.results).to.be.an('array').with.lengthOf(1);
        done();
      });
  });

  it('should return an empty list', (done) => {
    const query = {
      startDate: '2023-10-17',
      endDate: '2023-10-19',
      location: 'Ramat Gan',
      ageGroup: 25,
      carGroup: 'Sedan',
    };

    chai
      .request(app)
      .get('/api/cars/search')
      .query(query)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('results');
        expect(res.body.results).to.be.an('array').with.lengthOf(0);
        done();
      });
  });

  it('should return a 400 error for invalid query parameters', (done) => {
    chai
      .request(app)
      .get('/api/cars/search?invalidparam=value')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property(
          'message',
          'Invalid query parameters'
        );
        done();
      });
  });
});
