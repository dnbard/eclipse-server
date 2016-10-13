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

    describe('#getRadialVelocity', () => {
        it('should return radial velocity for 0%', () => {
            expect(Velocity.getRadialVelocity(0, 100, 100)).to.be.equal(100);
        });

        it('should return radial velocity for 50%', () => {
            expect(Velocity.getRadialVelocity(50, 100, 100)).to.be.equal(62.5);
        });

        it('should return radial velocity for 75%', () => {
            expect(Velocity.getRadialVelocity(75, 100, 100)).to.be.equal(43.75);
        });

        it('should return radial velocity for 100%', () => {
            expect(Velocity.getRadialVelocity(100, 100, 100)).to.be.equal(25);
        });
    });
});
