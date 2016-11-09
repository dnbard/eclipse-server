const expect = require('chai').expect;
const Actor = require('../../models/actor');
const BUFFS = require('../../enums/buffs');

describe('Actors Model', () => {
    var actor = null;

    beforeEach(() => actor = new Actor());

    describe('#setBuff', () => {
        it('should set new buff', () => {
            actor.setBuff(BUFFS.SANCTUARY, 100);
            expect(actor.buffs[BUFFS.SANCTUARY]).to.not.be.undefined;
        });
    });

    describe('#isBuffActive', () => {
        it('should return true', () => {
            actor.setBuff(BUFFS.SANCTUARY, 100);
            expect(actor.isBuffActive(BUFFS.SANCTUARY)).to.be.true;
        });

        it('should return false on empty buff', () => {
            expect(actor.isBuffActive(BUFFS.SANCTUARY)).to.be.false;
        });

        it('should return false', () => {
            actor.setBuff(BUFFS.SANCTUARY, 0);
            expect(actor.isBuffActive(BUFFS.SANCTUARY)).to.be.false;
        });
    });

    describe('#toJSON', () => {
        it('should convert to JSON', () => {
            expect(actor.toJSON()).to.be.an.object;
        });
    });

    describe('#isDestroyed', () => {
        it('should return false', () => {
            expect(actor.isDestroyed()).to.be.false;
        });
    });

    describe('#toFixed', () => {
        it('should return fixed number', () => {
            expect(actor.toFixed(10.02, 0)).to.be.equal(10);
            expect(actor.toFixed(9.07, 1)).to.be.equal(9.1);
        });
    });
});
