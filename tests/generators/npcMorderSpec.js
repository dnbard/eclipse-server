const expect = require('chai').expect;

const MorderDroneGenerator = require('../../generators/npcMorder');
const Player = require('../../models/player');

describe('Morder Drone Generator', () => {
    describe('#createOne', () => {
        it('should create one entity', () => {
            const entity = MorderDroneGenerator.createOne();
            expect(entity).to.be.instanceOf(Player);
        });
    });

    describe('#createFew', () => {
        it('should create several entities', () => {
            const entities = MorderDroneGenerator.createFew({ quantity: 4 });
            expect(entities).to.have.length(4);
            expect(entities[0]).to.be.instanceOf(Player);
        });
    });
});
