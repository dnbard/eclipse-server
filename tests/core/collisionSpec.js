const expect = require('chai').expect;

const GEOMETRY = require('../../enums/geometry');
const Collision = require('../../core/collision');

describe('Collision', () => {
    describe('#colliderPointPoint', () => {
        it('should return true', () => {
            expect(Collision.colliderPointPoint({ x: 0, y: 0 },{ x: 0, y: 0 })).to.be.true;
        });

        it('should return false', () => {
            expect(Collision.colliderPointPoint({ x: 0, y: 0 },{ x: 1, y: 1 })).to.be.false;
        });
    });

    describe('#colliderCirclePoint', () => {
        it('should return true', () => {
            expect(Collision.colliderCirclePoint({
                x: 0, y: 0, size: 16, geometry: GEOMETRY.CIRCLE
            },{
                x: 10, y: 10, geometry: GEOMETRY.POINT
            })).to.be.true;

            expect(Collision.colliderCirclePoint({
                x: 10, y: 10, geometry: GEOMETRY.POINT
            },{
                x: 0, y: 0, size: 16, geometry: GEOMETRY.CIRCLE
            })).to.be.true;
        });

        it('should return false', () => {
            expect(Collision.colliderCirclePoint({
                x: 0, y: 0, size: 16, geometry: GEOMETRY.CIRCLE
            },{
                x: 20, y: 20, geometry: GEOMETRY.POINT
            })).to.be.false;

            expect(Collision.colliderCirclePoint({
                x: 20, y: 20, geometry: GEOMETRY.POINT
            },{
                x: 0, y: 0, size: 16, geometry: GEOMETRY.CIRCLE
            })).to.be.false;
        });
    });

    describe('#getCollisionFunction', () => {
        it('should return #getGeometryFunction', () => {
            expect(Collision.getGeometryFunction(GEOMETRY.POINT, GEOMETRY.POINT))
                .to.be.equal(Collision.colliderPointPoint);
        });

        it('should return #colliderCirclePoint', () => {
            expect(Collision.getGeometryFunction(GEOMETRY.CIRCLE, GEOMETRY.POINT))
                .to.be.equal(Collision.colliderCirclePoint);

            expect(Collision.getGeometryFunction(GEOMETRY.POINT, GEOMETRY.CIRCLE))
                .to.be.equal(Collision.colliderCirclePoint);
        });

        it('should return null', () => {
            expect(Collision.getGeometryFunction()).to.be.null;

            expect(Collision.getGeometryFunction(GEOMETRY.POINT)).to.be.null;

            // temporary, until circle-circle function won't be implemented
            expect(Collision.getGeometryFunction(GEOMETRY.CIRCLE, GEOMETRY.CIRCLE)).to.be.null;
        });
    });
});
