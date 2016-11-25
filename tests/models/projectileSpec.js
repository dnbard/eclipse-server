const expect = require('chai').expect;

const Projectile = require('../../models/projectile');
const Actor = require('../../models/actor');


describe('Projectile Model', () => {
    var projectile = null;

    beforeEach(() => projectile = new Projectile());

    it('should be instance of Actor', () => {
        expect(projectile).to.be.instanceOf(Actor);
    });

    describe('#toJSON', () => {
        it('should create JS Object', () => {
            const p = projectile.toJSON();

            expect(p.id).to.be.string;
            expect(p.x).to.be.number;
            expect(p.y).to.be.number;
            expect(p.vx).to.be.number;
            expect(p.xy).to.be.number;
            expect(p.rotation).to.be.number;
            expect(p.kind).to.be.string;
        });
    });
});
