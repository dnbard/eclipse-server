const expect = require('chai').expect;
const Commands = require('../../core/commands');

describe('Commands', () => {
    beforeEach(() => {
        Commands.unregisterAll();
    });

    describe('#register', () => {
        it('should register a new command', (done) => {
            Commands.register(123, () => {
                done();
            });
            Commands.execute(123, {});
        });

        it('should throw error on second register', () => {
            Commands.register(123, () => {});
            expect(() => {
                Commands.register(123, () => {});
            }).to.throw(/already registered/);
        });
    });

    describe('#execute', () => {
        it('should execute registered command', (done) => {
            Commands.register(123, () => {
                done();
            });
            Commands.execute(123, {});
        });

        it('should throw error when called unregister command', () => {
            expect(() => {
                Commands.execute(123, () => {});
            }).to.throw(/not registered/);
        });
    });
});
