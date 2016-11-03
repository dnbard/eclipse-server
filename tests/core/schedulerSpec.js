const expect = require('chai').expect;
const Scheduler = require('../../core/scheduler');

describe('Scheduler', function(){
    beforeEach(Scheduler.removeAll);

    describe('#schedule', function(){
        it('should schedule new event', () => {
            const e = Scheduler.schedule({ ttl: 10, handler: () => {  } });
            expect(Scheduler.getAll()[0]).to.be.equal(e);
        });

        it('should sort events by @ttl', () => {
            const e1 = Scheduler.schedule({ ttl: 100, handler: () => {  } });
            const e2 = Scheduler.schedule({ ttl: 1, handler: () => {  } });
            const e3 = Scheduler.schedule({ ttl: 10, handler: () => {  } });

            const array = Scheduler.getAll();

            expect(array[0]).to.be.equal(e2);
            expect(array[array.length - 1]).to.be.equal(e1);
        });

        it('should schedule new event with arguments', () => {
            const args = { stage: 'stage' };
            const e = Scheduler.schedule({ ttl: 10, handler: () => {  }, args: args });

            expect(e.args).to.be.equal(args);
        });

        it('should accept extended arguments list', () => {
            const e = Scheduler.schedule(() => { }, 10);
            expect(Scheduler.getAll()[0]).to.be.equal(e);
        });

        it('should throw an error on empty variables', () => {
            expect(Scheduler.schedule).to.throw('Invalid or empty variables');
        });
    });

    describe('#getAll', () => {
        it('should return internal array', () => {
            Scheduler.schedule({ ttl: 10, handler: () => {  } });
            expect(Scheduler.getAll()).to.have.length(1);
        });
    });

    describe('#update', function(){
        it('should call event with low ttl', done => {
            Scheduler.schedule({ ttl: 10, handler: () => {
                done();
            }});
            Scheduler.update(1000);
        });

        it('should remove all called events', done => {
            Scheduler.schedule({ ttl: 10, handler: () => {
                expect(Scheduler.getAll()).to.have.length(0);
                done();
            }});
            Scheduler.update(1000);
        });

        it('should not call events with high ttl', () => {
            Scheduler.schedule({ ttl: 10, handler: () => { } });
            Scheduler.schedule({ ttl: 1000, handler: () => { } });

            Scheduler.update(1000);

            expect(Scheduler.getAll()).to.have.length(1);
        });
    });
});
