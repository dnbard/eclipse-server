const expect = require('chai').expect;
const Velocity = require('../../physics/velocity');

describe('Physics - Velocity', () => {
    describe('#get2DVelocity', () => {
        it('should return valid 2D velocity', () => {
            expect(Velocity.get2DVelocity(1, 50).x.toFixed(2)).to.be.equal('27.02');
            expect(Velocity.get2DVelocity(1, 50).y.toFixed(2)).to.be.equal('42.07');
        });

        it('should return horizontal velocity', () => {
            expect(Velocity.get2DVelocity(0, 50).x.toFixed(2)).to.be.equal('50.00');
            expect(Velocity.get2DVelocity(0, 50).y.toFixed(2)).to.be.equal('0.00');
        });

        it('should return vertical velocity', () => {
            expect(Velocity.get2DVelocity(Math.PI * 0.5, 50).x.toFixed(2)).to.be.equal('0.00');
            expect(Velocity.get2DVelocity(Math.PI * 0.5, 50).y.toFixed(2)).to.be.equal('50.00');
        });
    });
});
