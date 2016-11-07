const expect = require('chai').expect;
const PVP = require('../../core/pvp');

describe('PVP', () => {
    describe('#calculateRating', () => {
        it('should return ELO_K', () => {
            expect(PVP.calculateRating(1499, 2000)).to.be.equal(PVP.ELO_K);
            expect(PVP.calculateRating(0, 2000)).to.be.equal(PVP.ELO_K);
        });

        it('should return rating gains for half ELO_K', () => {
            expect(PVP.calculateRating(1600, 1600)).to.be.equal(PVP.ELO_K * 0.5);
        });

        it('should return rating gains for 2000-1600', () => {
            expect(PVP.calculateRating(2000, 1600).toFixed(2)).to.be.equal('4.36');
        });

        it('should return rating gains for 1600-2000', () => {
            expect(PVP.calculateRating(1600, 2000).toFixed(2)).to.be.equal('43.64');
        });

        it('should return rating gains for 1000-1000 death', () => {
            expect(PVP.calculateRating(1000, 1000, true).toFixed(2)).to.be.equal('19.20');
        });

        it('should return rating gains for 100-100 death', () => {
            expect(PVP.calculateRating(100, 100, true).toFixed(2)).to.be.equal('19.20');
        });
    });
});
