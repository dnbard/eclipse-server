const expect = require('chai').expect;

const Loot = require('../../models/loot');
const Actor = require('../../models/actor');



describe('Loot Model', () => {
    var loot = null;

    beforeEach(() => loot = new Loot({}));

    it('should be instance of Actor', () => {
        expect(loot).to.be.instanceOf(Actor);
    });

    it('should have non-zero vx, vy', () => {
        expect(loot.vx).to.be.a.number;
        expect(loot.vy).to.be.a.number;
        expect(loot.vx).to.not.be.zero;
        expect(loot.vy).to.not.be.zero;
    });

    it('should have non-zero rotationSpeed', () => {
        expect(loot.rotationSpeed).to.be.a.number;
        expect(loot.rotationSpeed).to.not.be.zero;
    });

    describe('#onUpdate', () => {
        it('should update rotation', () => {
            const oldRotation = loot.rotation;

            loot.onUpdate();

            expect(loot.rotation).to.not.be.equal(oldRotation);
        });

        it('should update position', () => {
            const oldX = loot.x;
            const oldY = loot.y;

            loot.onUpdate();

            expect(loot.x).to.not.be.equal(oldX);
            expect(loot.y).to.not.be.equal(oldY);
        });
    });

    describe('#toJSON', () => {
        it('should return JS Object', () => {
            const l = loot.toJSON();

            expect(l).to.be.an.object;
            expect(l.id).to.be.a.string;
            expect(l.x).to.be.a.number;
            expect(l.y).to.be.a.number;
            expect(l.rotation).to.be.a.number;
            expect(l.kind).to.be.a.string;
        });
    });
});
