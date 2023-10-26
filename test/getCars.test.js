const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /api/cars', () => {
  it('should return a list of cars', (done) => {
    chai
      .request(app)
      .get('/api/cars')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return a list of cars with specific properties', (done) => {
    chai
      .request(app)
      .get('/api/cars')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');

        for (const car of res.body) {
          expect(car).to.have.property('make');
          expect(car).to.have.property('model');
          expect(car).to.have.property('year');
        }

        done();
      });
  });
});
