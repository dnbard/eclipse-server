const expect = require('chai').expect;
const AggroGroup = require('../../models/aggroGroup');

describe('AggroGroup Model', () => {
    var group = null;

    beforeEach(() => group = new AggroGroup({ stage: { id: '123132132' } }));

    describe('JSON', () => {
        it('#createJSONView should create JSON view', () => {
            group.createJSONView();
            expect(group.JSONView).to.be.an.object;
        });

        it('#toJSON should return cached JSON', () => {
            expect(group.toJSON()).to.be.equal(group.JSONView);
        });
    });

    describe('iterators', () => {
        it('#_playerByType should return true', () => {
            expect(group._playerByType({ type: 'player-base' })).to.be.true;
        });

        it('#_playerByType should return false', () => {
            expect(group._playerByType({ type: 'npc-base' })).to.be.false;
        });

        it('#_actorsRemover should remove actor', done => {
            AggroGroup._actorsRemover({ isDestroyed: done });
        });
    });

    describe('#getAggroElement', () => {
        it('should return element by id', () => {
            group.aggroList.push({ id: '1' });
            expect(group.getAggroElement('1')).to.not.be.undefined;
        });

        it('should return undefined', () => {
            group.aggroList.push({ id: '1' });
            expect(group.getAggroElement('2')).to.be.undefined;
        });
    });

    describe('#createAggroElement', () => {
        it('should create new aggro element', () => {
            const aggro = group.createAggroElement({ id: '1' });
            expect(aggro).to.not.be.undefined;
        });
    });

    describe('#addAggro', () => {
        var aggro;

        beforeEach(() => {
            aggro = group.createAggroElement({ id: '1' });
            group.aggroList.push(aggro);
        });

        it('should add aggro to existing entity', () => {
            group.addAggro('1', 100);
            expect(aggro.value).to.be.equal(100);
        });

        it('should not add aggro to another entity', () => {
            group.addAggro('2', 100);
            expect(aggro.value).to.be.equal(0);
        });
    });

    describe('#removeAggro', () => {
        it('should remove all aggro for given entity', () => {
            const aggro = group.createAggroElement({ id: '1' });
            group.aggroList.push(aggro);
            group.removeAggro({ id: '1' });

            expect(group.aggroList).to.have.length(0);
        });
    });

    describe('#addToStage', () => {
        it('should call #addActor', done => {
            AggroGroup.addToStage(undefined, { addActor: done });
        });
    });
});
