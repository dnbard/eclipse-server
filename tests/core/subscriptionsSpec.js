const expect = require('chai').expect;
const Subscriptions = require('../../core/subscriptions');
const uuid = require('node-uuid').v4;


describe('Subscriptions', function(){
    afterEach(() => {
        Subscriptions.removeAll();
    });

    describe('#createSubscription', function(){
        it('should create new subscription', function(){
            const subscriber = uuid();
            Subscriptions.createSubscription(subscriber, uuid());

            expect(Subscriptions.getSubscriptionBySubscriberId(subscriber)).to.have.length(1);
        });
    });

    describe('#getSubscriptionBySubscriberId', function(){
        it('should return subscriptions', function(){
            const subscriber = uuid();
            Subscriptions.createSubscription(subscriber, uuid());

            expect(Subscriptions.getSubscriptionBySubscriberId(subscriber)).to.have.length(1);
        });
    });

    describe('#getSubscriptionBySubscribeToId', function(){
        it('should return subscriptions', function(){
            const subscriber = uuid();
            const subscribeTo = uuid();
            Subscriptions.createSubscription(subscriber, subscribeTo);

            expect(Subscriptions.getSubscriptionBySubscribeToId(subscribeTo)).to.have.length(1);
        });
    });

    describe('#removeSubscriptionById', function(){
        it('should remove subscription', function(){
            const subscriber = uuid();
            const subscription = Subscriptions.createSubscription(subscriber, uuid());
            Subscriptions.removeSubscriptionById(subscription.id);

            expect(Subscriptions.getSubscriptionBySubscriberId(subscriber)).to.have.length(0);
        });

        it('should not remove subscription if none', function(){
            Subscriptions.removeSubscriptionById(uuid());

            expect(Subscriptions.getSubscriptionBySubscriberId(uuid())).to.have.length(0);
        });
    });

    describe('#removeSubscriptionBySubscriberId', function(){
        it('should remove subscription', function(){
            const subscriber = uuid();
            Subscriptions.createSubscription(subscriber, uuid());
            Subscriptions.removeSubscriptionBySubscriberId(subscriber);

            expect(Subscriptions.getSubscriptionBySubscriberId(subscriber)).to.have.length(0);
        });

        it('should not remove subscription if none', function(){
            Subscriptions.removeSubscriptionBySubscriberId(uuid());

            expect(Subscriptions.getSubscriptionBySubscriberId(uuid())).to.have.length(0);
        });
    });

    describe('#removeAll', function(){
        it('should remove all subscriptions', function(){
            const subscriber = uuid();
            Subscriptions.createSubscription(uuid(), uuid());
            Subscriptions.createSubscription(subscriber, uuid());
            Subscriptions.createSubscription(subscriber, uuid());
            Subscriptions.createSubscription(uuid(), uuid());
            Subscriptions.createSubscription(uuid(), uuid());
            Subscriptions.removeAll();

            expect(Subscriptions.getSubscriptionBySubscriberId(subscriber)).to.have.length(0);
        });
    });
});
