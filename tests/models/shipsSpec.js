const expect = require('chai').expect;

const Ships = require('../../models/spaceship');

describe('Ships Model', () => {
    var ship = null;

    beforeEach(() => ship = new Ships({
        rigs: [ "turret-ion" ]
    }));

    describe('#get', () => {
        it('should return undefined for non-existant value', () => {
            expect(ship.get('key')).to.be.undefined;
        });

        it('should return base value', () => {
            ship = new Ships({ key: 1 });
            expect(ship.get('key')).to.be.equal(1);
        });

        it('should return modified value', () => {
            ship = new Ships({ key: 1 }, { key: 1 });
            expect(ship.get('key')).to.be.equal(2);
        });
    });

    describe('#getTurrets', () => {
        it('should return list of turret rigs', () => {
            expect(ship.getTurrets()).to.have.length(1);
        });
    });

    describe('#equip', () => {
        it('should add rig', () => {
            ship.equip('turret-ion');
            expect(ship.getTurrets()).to.have.length(2);
        });
    });

    describe('#unequip', () => {
        it('should remove rig', () => {
            ship.unequip('turret-ion');
            expect(ship.getTurrets()).to.have.length(0);
        });
    });
});
