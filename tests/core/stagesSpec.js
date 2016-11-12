const expect = require('chai').expect;
const Stages = require('../../core/stages');
const uuid = require('node-uuid').v4;

describe('Stages', function(){
    afterEach(function(){
        Stages.removeAll();
    });

    describe('#getOrCreateGeneric', function(){
        it('should create default stage', function(){
            const stage = Stages.getOrCreateGeneric();

            expect(stage).to.be.an.object;
            expect(stage.id).to.be.a.string;
            expect(stage.actors).to.be.an.array
            expect(stage.generic).to.be.a.boolean;
        });

        it('should always return same generic stage', function(){
            const stage1 = Stages.getOrCreateGeneric();
            const stage2 = Stages.getOrCreateGeneric();

            expect(stage1).to.deep.equal(stage2);
        });
    });

    describe('#removeAll', function(){
        it('should erase all stages', function(){
            Stages.createAllStages();
            Stages.removeAll();

            expect(Stages.length()).to.be.equal(0);
        });
    });

    describe('#length', function(){
        it('should return number of stages in collection', function(){
            Stages.createAllStages();

            expect(Stages.length()).to.be.above(0);
        });
    });
});
