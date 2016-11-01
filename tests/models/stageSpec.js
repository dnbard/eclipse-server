const expect = require('chai').expect;
const sinon = require('sinon');

const Stage = require('../../models/stage');
const AggroGroup = require('../../models/aggroGroup');

describe('Stage Model', () => {
    var stage = undefined;

    beforeEach(() => stage = new Stage());
    afterEach(() => stage = undefined);

    it('should not be undefined', () => {
        expect(stage).to.not.be.undefined;
    });

    describe('#createGroup', () => {
        it('should create new AggroGroup', () => {
            const group = stage.createGroup();
            expect(group).to.be.instanceOf(AggroGroup);
        });

        it('should store new group', () => {
            const group = stage.createGroup();
            expect(stage.groups[0]).to.equal(group);
        });
    });

    describe('#addGroup', () => {
        it('should add existing group to stage', () => {
            const group = new AggroGroup({ stage: stage, actors: [] });
            stage.addGroup(group);
            expect(stage.groups[0]).to.equal(group);
        });
    });

    describe('#removeGroupById', () => {
        it('should remove group', () => {
            const group = stage.createGroup();
            stage.removeGroupById(group.id);
            expect(stage.groups[0]).to.be.undefined;
        });
    });

    describe('#removeAggro', () => {
        it('should throw an error on invalid arguments', () => {
            expect(stage.removeAggro).to.throw(/"entity" should be valid object/);
        });

        it('should call group #removeAggro', () => {
            const group = stage.createGroup();
            const spy = sinon.stub(group, 'removeAggro');
            stage.removeAggro({ id: 'some-id' })

            expect(spy.called).to.be.true;
            group.removeAggro.restore();
        });
    });

    describe('#generateName', () => {
        it('should return non-empty string', () => {
            const name = stage.generateName();

            expect(name).to.be.a('string');
            expect(name.length).to.not.be.zero;
        });
    });

    describe('#addActor', () => {
        it('should add existing actor to stage', () => {
            const actor = { id: 'an actor' };
            stage.addActor(actor);
            expect(stage.actors[0]).to.equal(actor);
        });
    });

    describe('removeActorById', () => {
        it('should remove actor', () => {
            const actor = { id: 'an actor' };
            stage.addActor(actor);
            stage.removeActorById(actor.id);

            expect(stage.actors[0]).to.be.undefined;
        });
    });
});
