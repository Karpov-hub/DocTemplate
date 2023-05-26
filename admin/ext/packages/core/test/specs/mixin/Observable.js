/* global A */
(function() {
function makeObservableSuite(isMixin) {
    topSuite(isMixin ? "Ext.mixin.Observable" : "Ext.util.Observable", ['Ext.Container'], function() {
        // @define Observable
        var Observable = isMixin ? Ext.mixin.Observable : Ext.util.Observable,
            Boss,
            boss,
            bossConfig,
            bossListeners,
            bossAskListener,
            bossAskFn,
            bossFiredFn,
            bossFired2Fn,
            bossQuitFn,
            fakeScope;

        function makeDefaultListenerScope(o) {
            o.resolveListenerScope = function() {
                if (!this.defaultScope) {
                    this.defaultScope = {
                        meth1: function() {
                        },
                        resolveListenerScope: function() {
                            return null;
                        }
                    };
                }

                return this.defaultScope;
            };
        }

        function spyOnEvent(object, eventName, fn, options) {
            var listeners = Ext.apply({}, options),
                spy;

            listeners[eventName] = fn || Ext.emptyFn;
            spy = spyOn(listeners, eventName);
            object.addListener(listeners);

            return spy;
        }

        afterEach(function() {
            Observable.prototype.fireEventArgs.target = null;
        });

        describe("constructor", function() {
            it("should allow the constructor to be called multiple times", function() {
                // In this test a class (Cls) uses two mixins that derive from Observable
                // and also mixes in observable itself.  The class calls the constructor
                // of both mixins and the Observable constructor from its constructor.
                // This results in 3 calls to the Observable constructor.  Since all 3 of
                // these calls are equivalent, only the first one should have any effect.
                // Successive calls should not re-initialize anything that was already
                // initialized by the first constructor call.
                var MixinA = Ext.define(null, {
                        extend: Observable
                    }),
                    MixinB = Ext.define(null, {
                        extend: Observable
                    }),
                    Cls = Ext.define(null, {
                        mixins: {
                            mixinA: MixinA,
                            mixinB: MixinB,
                            observable: Observable
                        },
                        constructor: function(config) {
                            var initConfig = spyOn(this, 'initConfig').andCallThrough(),
                                isMixinObservable = Observable.$className === 'Ext.mixin.Observable',
                                hasListeners, events;

                            this.mixins.mixinA.constructor.call(this, config);

                            if (isMixinObservable) {
                                expect(initConfig).toHaveBeenCalledWith({ foo: 'bar' });
                            }
                            else {
                                expect(this.foo).toBe('bar');
                            }

                            // After the first invocation of the constructor a couple objects
                            // are created.  Cache these so we can make sure that successive
                            // invocations do not recreate these objects
                            hasListeners = this.hasListeners;
                            events = this.events;

                            this.mixins.observable.constructor.call(this, config);

                            expect(this.hasListeners).toBe(hasListeners);
                            expect(this.events).toBe(events);

                            this.mixins.mixinB.constructor.call(this, config);

                            expect(this.hasListeners).toBe(hasListeners);
                            expect(this.events).toBe(events);

                            if (isMixinObservable) {
                                expect(initConfig.callCount).toBe(1);
                            }
                        }
                    });

                new Cls({ foo: 'bar' });
            });
        });

        describe("destroyable", function() {
            describe('listeners', function() {
                it('should remove the listeners when you destroy the returned Destroyable', function() {
                    var newBoss = new Boss(),
                        listenerDestroyable = newBoss.on({
                            fired: function() {

                            },
                            quit: function() {

                            },
                            ask_salary_augmentation: function() {

                            },
                            destroyable: true
                        });

                    expect(newBoss.hasListeners.fired).toEqual(1);
                    expect(newBoss.hasListeners.quit).toEqual(1);
                    expect(newBoss.hasListeners.ask_salary_augmentation).toEqual(1);
                    listenerDestroyable.destroy();
                    expect(newBoss.hasListeners.fired).toBeUndefined();
                    expect(newBoss.hasListeners.quit).toBeUndefined();
                    expect(newBoss.hasListeners.ask_salary_augmentation).toBeUndefined();
                });
            });

            describe('managed listeners', function() {
                it('should remove managed listeners when you destroy the returned Destroyable', function() {
                    var newBoss = new Boss(),
                        listenerDestroyable = newBoss.mon(newBoss, {
                            fired: function() {

                            },
                            quit: function() {

                            },
                            ask_salary_augmentation: function() {

                            },
                            destroyable: true
                        });

                    expect(newBoss.hasListeners.fired).toEqual(1);
                    expect(newBoss.hasListeners.quit).toEqual(1);
                    expect(newBoss.hasListeners.ask_salary_augmentation).toEqual(1);
                    listenerDestroyable.destroy();
                    expect(newBoss.hasListeners.fired).toBeUndefined();
                    expect(newBoss.hasListeners.quit).toBeUndefined();
                    expect(newBoss.hasListeners.ask_salary_augmentation).toBeUndefined();
                });
            });

        });

        describe("instantiation", function() {
            describe("config initialization", function() {
                if (Observable === Ext.mixin.Observable) {
                    it("should invoke initConfig", function() {
                        var Foo = Ext.define(null, {
                            extend: Observable
                        });

                        spyOn(Foo.prototype, 'initConfig');
                        spyOn(Ext, 'apply');

                        var foo = new Foo({ x: 1 });

                        expect(Foo.prototype.initConfig).toHaveBeenCalledWith({ x: 1 });
                        expect(Ext.apply).not.toHaveBeenCalled();
                        foo.destroy();
                    });

                    it("should apply configuration if $applyConfigs is true", function() {
                        var Foo = Ext.define(null, {
                            extend: Observable,
                            $applyConfigs: true
                        });

                        spyOn(Foo.prototype, 'initConfig');
                        spyOn(Ext, 'apply');

                        var foo = new Foo({ x: 1 });

                        expect(Ext.apply).toHaveBeenCalledWith(foo, { x: 1 });
                        expect(Foo.prototype.initConfig).not.toHaveBeenCalled();
                        foo.destroy();
                    });
                }
                else {
                    it("should apply configuration", function() {
                        var Foo = Ext.define(null, {
                            extend: Observable
                        });

                        spyOn(Foo.prototype, 'initConfig');
                        spyOn(Ext, 'apply');

                        var foo = new Foo({ x: 1 });

                        expect(Ext.apply).toHaveBeenCalledWith(foo, { x: 1 });
                        expect(Foo.prototype.initConfig).not.toHaveBeenCalled();
                        foo.destroy();
                    });

                    it("should invoke initConfig if $applyConfigs is false", function() {
                        var Foo = Ext.define(null, {
                            extend: Observable,
                            $applyConfigs: false
                        });

                        spyOn(Foo.prototype, 'initConfig');
                        spyOn(Ext, 'apply');

                        var foo = new Foo({ x: 1 });

                        expect(Foo.prototype.initConfig).toHaveBeenCalledWith({ x: 1 });
                        expect(Ext.apply).not.toHaveBeenCalled();
                        foo.destroy();
                    });
                }
            });
        });

        describe("event name normalization", function() {
            var spy, o;

            beforeEach(function() {
                spy = jasmine.createSpy();
                o = new Observable();
            });

            describe("firing", function() {
                it("should match when firing with lower case", function() {
                    o.on('FOO', spy);
                    o.fireEvent('foo');
                    expect(spy).toHaveBeenCalled();
                });

                it("should match when firing with mixed case", function() {
                    o.on('foo', spy);
                    o.fireEvent('FOO');
                    expect(spy).toHaveBeenCalled();
                });

                describe("using mon", function() {
                    var o2;

                    beforeEach(function() {
                        o2 = new Observable();
                    });

                    it("should match when firing with lower case", function() {
                        o2.mon(o, 'FOO', spy);
                        o.fireEvent('foo');
                        expect(spy).toHaveBeenCalled();
                    });

                    it("should match when firing with mixed case", function() {
                        o2.mon(o, 'foo', spy);
                        o.fireEvent('FOO');
                        expect(spy).toHaveBeenCalled();
                    });
                });
            });

            describe("removing", function() {
                it("should match when removing with lower case", function() {
                    o.on('FOO', spy);
                    o.un('foo', spy);
                    o.fireEvent('foo');
                    expect(spy).not.toHaveBeenCalled();
                });

                it("should match when removing with mixed case", function() {
                    o.on('foo', spy);
                    o.un('FOO', spy);
                    o.fireEvent('FOO');
                    expect(spy).not.toHaveBeenCalled();
                });

                describe("using mon/mun", function() {
                    var o2;

                    beforeEach(function() {
                        o2 = new Observable();
                    });

                    it("should match when removing with lower case", function() {
                        o2.mon(o, 'FOO', spy);
                        o2.mun(o, 'foo', spy);
                        o.fireEvent('foo');
                        expect(spy).not.toHaveBeenCalled();
                    });

                    it("should match when removing with mixed case", function() {
                        o2.mon(o, 'foo', spy);
                        o2.mun(o, 'FOO', spy);
                        o.fireEvent('FOO');
                        expect(spy).not.toHaveBeenCalled();
                    });
                });
            });

            describe("hasListener(s)", function() {
                it("should use lower case for hasListeners", function() {
                    o.on('FOO', spy);
                    expect(o.hasListeners.foo).toBe(1);
                });

                it("should use lower case for hasListener", function() {
                    o.on('FOO', spy);
                    expect(o.hasListener('foo')).toBe(true);
                });

                describe("using mon", function() {
                    var o2;

                    beforeEach(function() {
                        o2 = new Observable();
                    });

                    it("should use lower case for hasListeners", function() {
                        o2.mon(o, 'FOO', spy);
                        expect(o.hasListeners.foo).toBe(1);
                    });

                    it("should use lower case for hasListener", function() {
                        o2.mon(o, 'FOO', spy);
                        expect(o.hasListener('foo')).toBe(true);
                    });
                });
            });

            describe("suspend/resume", function() {
                it("should ignore case when asking if an event is suspended", function() {
                    o.suspendEvent('FOO');
                    expect(o.isSuspended('foo')).toBe(true);
                });

                it("should ignore case when resuming events", function() {
                    o.on('foo', spy);
                    o.suspendEvent('FOO');
                    o.fireEvent('foo');
                    expect(spy).not.toHaveBeenCalled();
                    o.resumeEvent('FoO');
                    o.fireEvent('fOo');
                    expect(spy).toHaveBeenCalled();
                });
            });

            describe("bubbling", function() {
                it("should ignore case when bubbling events", function() {
                    var other = new Observable();

                    other.on('foo', spy);
                    o.enableBubble('FOO');

                    o.getBubbleTarget = function() {
                        return other;
                    };

                    o.fireEvent('foo');
                    expect(spy).toHaveBeenCalled();
                });
            });
        });

        describe("firing events", function() {

            describe("with options", function() {
                describe("single", function() {
                    var singleFn;

                    beforeEach(function() {
                        singleFn = jasmine.createSpy("singleFn");
                        boss.addListener("singleevent", singleFn, fakeScope, {
                            single: true
                        });

                        boss.fireEvent("singleevent", "single 1");
                        boss.fireEvent("singleevent", "single 2");
                        boss.fireEvent("singleevent", "single 3");
                    });

                    it("should call the handler only one times", function() {
                        expect(singleFn.callCount).toEqual(1);
                    });

                    it("should call the handler function with passed arguments", function() {
                        expect(singleFn).toHaveBeenCalledWith("single 1", {
                            single: true
                        });
                    });

                    it("should call the handler function with the correct scope", function() {
                        expect(singleFn.calls[0].object).toBe(fakeScope);
                    });

                    it("should remove the listener", function() {
                        expect(boss.hasListener("singleevent")).toBe(false);
                    });

                    it("should fire with dynamic scope resoution", function() {
                        boss = new Boss();
                        makeDefaultListenerScope(boss);
                        var spy = spyOn(boss.resolveListenerScope(), 'meth1');

                        boss.addListener("singleevent", 'meth1', undefined, {
                            single: true
                        });

                        boss.fireEvent("singleevent", "single 1");
                        boss.fireEvent("singleevent", "single 2");
                        boss.fireEvent("singleevent", "single 3");
                        expect(spy.callCount).toBe(1);

                    });
                });

                describe("target", function() {
                    var ct,
                        callbackFn,
                        callbackFn2;

                    beforeEach(function() {
                        ct = Ext.create('Ext.container.Container', {
                            items: [{
                                bubbleEvents: ['add', 'remove'],
                                xtype: 'container',
                                itemId: 'foo',
                                items: [{
                                    bubbleEvents: ['add', 'remove'],
                                    xtype: 'component',
                                    itemId: 'bar'
                                }, {
                                    bubbleEvents: ['add', 'remove'],
                                    xtype: 'component',
                                    itemId: 'baz'
                                }]
                            }]
                        });
                        callbackFn = jasmine.createSpy('callbackFn');
                        callbackFn2 = jasmine.createSpy('callbackFn2');
                    });

                    afterEach(function() {
                        ct.destroy();
                    });

                    it("should bubble up to its owner containers when target is not defined", function() {
                        ct.on(
                            'remove',
                            callbackFn
                        );

                        ct.getComponent('foo').on(
                            'remove',
                            callbackFn2
                        );

                        ct.getComponent('foo').remove('bar');

                        expect(callbackFn).toHaveBeenCalled();
                        expect(callbackFn2).toHaveBeenCalled();
                    });

                    it("should not bubble up to its owner containers when target is defined on a different observable", function() {
                        ct.on(
                            'remove',
                            callbackFn,
                            ct,
                            { target: ct }
                        );

                        ct.getComponent('foo').on(
                            'remove',
                            callbackFn2,
                            ct,
                            { target: ct }
                        );

                        ct.getComponent('foo').remove('baz');

                        expect(callbackFn).not.toHaveBeenCalled();
                        expect(callbackFn2).not.toHaveBeenCalled();
                    });

                    it("should not bubble up to its owner container but will bubble up to its ancestor", function() {
                        ct.on(
                            'add',
                            callbackFn
                        );

                        ct.getComponent('foo').on(
                            'add',
                            callbackFn2,
                            ct,
                            { target: ct }
                        );

                        ct.getComponent('foo').add({
                            xtype: 'component',
                            itemId: 'test'
                        });

                        expect(callbackFn).toHaveBeenCalled();
                        expect(callbackFn2).not.toHaveBeenCalled();
                    });

                    it("should fire with dynamic scope resolution", function() {
                        makeDefaultListenerScope(ct);
                        var spy = spyOn(ct.resolveListenerScope(), 'meth1');

                        ct.on('add', 'meth1', undefined, {
                            target: ct
                        });

                        ct.add({
                            xtype: 'component',
                            itemId: 'test'
                        });

                        expect(spy).toHaveBeenCalled();
                    });
                });

                describe("buffer", function() {
                    var bufferFn;

                    beforeEach(function() {
                        bufferFn = jasmine.createSpy("bufferFn");
                        boss.addListener("bufferevent", bufferFn, fakeScope, {
                            buffer: 5
                        });

                        boss.fireEvent("bufferevent", "buffer 1");
                        boss.fireEvent("bufferevent", "buffer 2");
                        boss.fireEvent("bufferevent", "buffer 3");
                    });

                    it("should not call handler immediately", function() {
                        expect(bufferFn).not.toHaveBeenCalled();
                        waitsForSpy(bufferFn);
                    });

                    it("should call the handler only one times after a certain amount of time", function() {
                        waitsForSpy(bufferFn, "bufferFn to be called");
                    });

                    it("should call the handler function with passed arguments coming from the last event firing", function() {
                        waitsForSpy(bufferFn, "bufferFn to be called");

                        runs(function() {
                            expect(bufferFn.calls[0].args[0]).toBe("buffer 3");
                        });
                    });

                    it("should call the handler function with the correct scope", function() {
                        waitsForSpy(bufferFn, "bufferFn to be called");

                        runs(function() {
                            expect(bufferFn.calls[0].object).toBe(fakeScope);
                        });
                    });

                    it("should not remove the listener", function() {
                        waitsForSpy(bufferFn, "bufferFn to be called");

                        runs(function() {
                            expect(boss.hasListener("bufferevent")).toBe(true);
                        });
                    });

                    it("should fire with dynamic scope resolution", function() {
                        boss = new Boss();
                        makeDefaultListenerScope(boss);
                        var spy = spyOn(boss.resolveListenerScope(), 'meth1');

                        boss.on("bufferevent", 'meth1', undefined, {
                            buffer: 5
                        });

                        boss.fireEvent("bufferevent", "buffer 1");
                        boss.fireEvent("bufferevent", "buffer 2");
                        boss.fireEvent("bufferevent", "buffer 3");

                        waitsForSpy(spy, "spy to be called");

                        runs(function() {
                            expect(spy.callCount).toBe(1);
                        });
                    });
                });

                describe("delay", function() {
                    var delayFn;

                    beforeEach(function() {
                        delayFn = jasmine.createSpy("delayFn");
                        boss.addListener("delayevent", delayFn, fakeScope, {
                            delay: 5
                        });

                        boss.fireEvent("delayevent", "delay");
                    });

                    it("should not call handler immediately", function() {
                        expect(delayFn).not.toHaveBeenCalled();
                        waitsForSpy(delayFn);
                    });

                    it("should call the handler only one times after a certain amount of time", function() {
                        waitsForSpy(delayFn, "delayFn to be called");
                    });

                    it("should call the handler function with passed arguments", function() {
                        waitsForSpy(delayFn, "delayFn to be called");

                        runs(function() {
                            expect(delayFn.calls[0].args[0]).toBe("delay");
                        });
                    });

                    it("should call the handler function with the correct scope", function() {
                        waitsForSpy(delayFn, "delayFn to be called");

                        runs(function() {
                            expect(delayFn.calls[0].object).toBe(fakeScope);
                        });
                    });

                    it("should fire with dynamic scope resolution", function() {
                        boss = new Boss();
                        makeDefaultListenerScope(boss);
                        var spy = spyOn(boss.resolveListenerScope(), 'meth1');

                        boss.on("delayevent", 'meth1', undefined, {
                            delay: 5
                        });

                        boss.fireEvent("delayevent", "buffer 1");

                        waitsForSpy(delayFn, "delayFn to be called");

                        runs(function() {
                            expect(spy).toHaveBeenCalled();
                        });
                    });
                });

                describe("priority", function() {
                    var a, result;

                    beforeEach(function() {
                        Ext.define('A', {
                            extend: Observable
                        });
                        a = new A();
                        result = [];
                    });

                    afterEach(function() {
                        Ext.undefine('A');
                    });

                    it("should call the handlers in priority order", function() {
                        a.on('foo', function() {
                            result.push(10);
                        }, null, { priority: 10 });

                        a.on('foo', function() {
                            result.push('u1');
                        }, null);

                        a.on('foo', function() {
                            result.push(-7);
                        }, null, { priority: -7 });

                        a.on('foo', function() {
                            result.push(0);
                        }, null, { priority: 0 });

                        a.on('foo', function() {
                            result.push(5);
                        }, null, { priority: 5 });

                        a.on('foo', function() {
                            result.push(-3);
                        }, null, { priority: -3 });

                        a.on('foo', function() {
                            result.push('u2');
                        });

                        a.fireEvent('foo');

                        expect(result.join(' ')).toBe('10 5 u1 0 u2 -3 -7');
                    });

                    it("should add a 0 priority listener after removal of a positive priority listener, when the listeners array contains negative priority listeners", function() {
                        // This spec is needed because of the inner workings of the priority
                        // mechanism. Internally, to avoid excessive looping, it tracks a
                        // highestNegativePriorityIndex so that when a 0 or undefined priority
                        // listener is added it can simply be inserted before the listener
                        // with the highest negative index.  This spec ensures the internal
                        // index gets updated when listeners are removed.
                        function f10() {
                            result.push(10);
                        }

                        a.on('foo', function() {
                            result.push('u1');
                        });
                        a.on('foo', f10, null, { priority: 10 });
                        a.on('foo', function() {
                            result.push(-7);
                        }, null, { priority: -7 });
                        a.on('foo', function() {
                            result.push(5);
                        }, null, { priority: 5 });
                        a.un('foo', f10);
                        a.on('foo', function() {
                            result.push('u2');
                        });

                        a.fireEvent('foo');

                        expect(result.join(' ')).toBe('5 u1 u2 -7');
                    });
                });

                describe("order", function() {
                    var a, result;

                    beforeEach(function() {
                        Ext.define('A', {
                            extend: Observable
                        });
                        a = new A();
                        result = [];
                    });

                    afterEach(function() {
                        Ext.undefine('A');
                    });

                    it("should fire events in the correct order using the order event option", function() {
                        a.on('foo', function() {
                            result.push(101);
                        }, null, { priority: 101 });

                        a.on('foo', function() {
                            result.push('after');
                        }, null, { order: 'after' });

                        a.on('foo', function() {
                            result.push(-101);
                        }, null, { priority: -101 });

                        a.on('foo', function() {
                            result.push('before');
                        }, null, { order: 'before' });

                        a.on('foo', function() {
                            result.push('current');
                        }, null, { order: 'current' });

                        a.on('foo', function() {
                            result.push(0);
                        }, null, { priority: 0 });

                        a.fireEvent('foo');

                        expect(result.join(' ')).toBe('101 before current 0 after -101');
                    });

                    it("should fire events in the correct order using the order method parameter", function() {
                        a.on('foo', function() {
                            result.push(101);
                        }, null, { priority: 101 });

                        a.on('foo', function() {
                            result.push('after');
                        }, null, null, 'after');

                        a.on('foo', function() {
                            result.push(-101);
                        }, null, { priority: -101 });

                        a.on('foo', function() {
                            result.push('before');
                        }, null, null, 'before');

                        a.on('foo', function() {
                            result.push('current');
                        }, null, null, 'current');

                        a.on('foo', function() {
                            result.push(0);
                        }, null, { priority: 0 });

                        a.fireEvent('foo');

                        expect(result.join(' ')).toBe('101 before current 0 after -101');
                    });
                });
            });
        });

        describe("adding/removing listeners", function() {
            describe("use a string as first param", function() {
                beforeEach(function() {
                    boss.addListener("fired", bossFiredFn, fakeScope);
                    boss.fireEvent("fired", "I'am fired! (1)");
                    boss.removeListener("fired", bossFiredFn, fakeScope);
                    boss.fireEvent("fired", "I'am fired! (2)");
                });

                it("should call the event handler only one time", function() {
                    expect(bossFiredFn.callCount).toEqual(1);
                });

                it("should call the event with correct arguments", function() {
                    expect(bossFiredFn).toHaveBeenCalledWith("I'am fired! (1)");
                });

                it("should call the event with correct scope", function() {
                    expect(bossFiredFn.calls[0].object).toBe(fakeScope);
                });
            });

            describe("use an object as first param without using fn to specify the function", function() {
                var listeners;

                beforeEach(function() {

                    listeners = {
                        fired: bossFiredFn,
                        scope: fakeScope
                    };

                    boss.addListener(listeners);
                    boss.fireEvent("fired", "I'am fired! (1)");
                    boss.removeListener(listeners);
                    boss.fireEvent("fired", "I'am fired! (2)");
                });

                it("should call the event handler only one time", function() {
                    expect(bossFiredFn.callCount).toEqual(1);
                });

                it("should call the event with correct arguments", function() {
                    expect(bossFiredFn).toHaveBeenCalledWith("I'am fired! (1)", listeners);
                });

                it("should call the event with correct scope", function() {
                    expect(bossFiredFn.calls[0].object).toBe(fakeScope);
                });
            });

            describe("use an object as first param using fn to specify the function", function() {
                var listeners,
                    firedListener;

                beforeEach(function() {
                    firedListener = {
                        fn: bossFiredFn,
                        scope: fakeScope
                    };
                    listeners = {
                        fired: firedListener
                    };

                    boss.addListener(listeners);
                    boss.fireEvent("fired", "I'am fired! (1)");
                    boss.removeListener(listeners);
                    boss.fireEvent("fired", "I'am fired! (2)");
                });

                it("should call the event handler only one time", function() {
                    expect(bossFiredFn.callCount).toEqual(1);
                });

                it("should call the event with correct arguments", function() {
                    expect(bossFiredFn).toHaveBeenCalledWith("I'am fired! (1)", firedListener);
                });

                it("should call the event with correct scope", function() {
                    expect(bossFiredFn.calls[0].object).toBe(fakeScope);
                });
            });

            describe("add/remove using function name as string", function() {
                beforeEach(function() {
                    fakeScope = {
                        bossFired: bossFiredFn
                    };
                });

                afterEach(function() {
                    fakeScope = null;
                });

                describe("with object scope", function() {
                    beforeEach(function() {
                        boss.addListener('fired', 'bossFired', fakeScope);
                        boss.fireEvent('fired', "I'm fired! (1)");
                        boss.removeListener('fired', 'bossFired', fakeScope);
                        boss.fireEvent('fired', "I'm fired! (2)");
                    });

                    it("should call the event handler only once", function() {
                        expect(bossFiredFn.callCount).toEqual(1);
                    });

                    it("should call the event with correct arguments", function() {
                        expect(bossFiredFn).toHaveBeenCalledWith("I'm fired! (1)");
                    });

                    it("should call the event with correct scope", function() {
                        expect(bossFiredFn.calls[0].object).toBe(fakeScope);
                    });

                    it("should only call the function once", function() {
                        expect(bossFiredFn.callCount).toBe(1);
                    });
                });

                describe("with scope: 'this'", function() {
                    var spy;

                    beforeEach(function() {
                        spy = spyOn(boss, 'doSomething');
                        boss.addListener('fired', 'doSomething', 'this');
                        boss.fireEvent('fired', "I'm fired! (1)");
                        boss.removeListener('fired', 'doSomething', 'this');
                        boss.fireEvent('fired', "I'm fired! (2)");
                    });

                    it("should call the event handler only once", function() {
                        expect(spy.callCount).toEqual(1);
                    });

                    it("should call the event with correct arguments", function() {
                        expect(spy).toHaveBeenCalledWith("I'm fired! (1)");
                    });

                    it("should call the event with correct scope", function() {
                        expect(spy.calls[0].object).toBe(boss);
                    });

                    it("should only call the function once", function() {
                        expect(spy.callCount).toBe(1);
                    });
                });

                describe("with scope: 'controller'", function() {
                    var spy;

                    it("throw while firing", function() {
                        spy = spyOn(boss, 'doSomething');
                        boss.addListener('fired', 'doSomething', 'controller');
                        expect(function() {
                            boss.fireEvent('fired', "I'm fired! (1)");
                        }).toThrow();
                    });

                    it("should be able to remove listeners", function() {
                        spy = spyOn(boss, 'doSomething');
                        boss.addListener('fired', 'doSomething', 'controller');
                        boss.removeListener('fired', 'doSomething', 'controller');
                        boss.fireEvent('fired', "I'm fired! (2)");
                        expect(spy).not.toHaveBeenCalled();
                    });
                });

                describe("with no scope specified", function() {
                    describe("without a default listener scope holder", function() {
                        beforeEach(function() {
                            boss.bossFired = bossFiredFn;
                            boss.addListener('fired', 'bossFired');
                            boss.fireEvent('fired', "I'm fired! (1)");
                            boss.removeListener('fired', 'bossFired');
                            boss.fireEvent('fired', "I'm fired! (2)");
                        });

                        it("should call the event handler only once", function() {
                            expect(bossFiredFn.callCount).toEqual(1);
                        });

                        it("should call the event with correct arguments", function() {
                            expect(bossFiredFn).toHaveBeenCalledWith("I'm fired! (1)");
                        });

                        it("should call the event with correct scope", function() {
                            expect(bossFiredFn.calls[0].object).toBe(boss);
                        });

                        it("should only call the function once", function() {
                            expect(bossFiredFn.callCount).toBe(1);
                        });

                        it("should raise an error if fn cannot be resolved when firing", function() {
                            expect(function() {
                                boss.addListener('fired', 'bossFiredAgain');
                                boss.fireEvent('fired');
                            }).toThrow();
                        });
                    });

                    describe("with a default listener scope", function() {
                        beforeEach(function() {
                            makeDefaultListenerScope(boss);
                            boss.resolveListenerScope().bossFired = bossFiredFn;
                            boss.addListener('fired', 'bossFired');
                            boss.fireEvent('fired', "I'm fired! (1)");
                            boss.removeListener('fired', 'bossFired');
                            boss.fireEvent('fired', "I'm fired! (2)");
                        });

                        it("should call the event handler only once", function() {
                            expect(bossFiredFn.callCount).toEqual(1);
                        });

                        it("should call the event with correct arguments", function() {
                            expect(bossFiredFn).toHaveBeenCalledWith("I'm fired! (1)");
                        });

                        it("should call the event with correct scope", function() {
                            expect(bossFiredFn.calls[0].object).toBe(boss.resolveListenerScope());
                        });

                        it("should only call the function once", function() {
                            expect(bossFiredFn.callCount).toBe(1);
                        });

                        it("should raise an error if fn cannot be resolved when firing", function() {
                            expect(function() {
                                boss.addListener('fired', 'bossFiredAgain');
                                boss.fireEvent('fired');
                            }).toThrow();
                        });
                    });
                });
            });

            describe("remove a listener when a buffered handler hasn't fired yet", function() {
                it("should never call the handler", function() {
                    runs(function() {
                        boss.addListener("fired", bossFiredFn, fakeScope, { buffer: 5 });
                        boss.fireEvent("fired");
                        boss.removeListener("fired", bossFiredFn, fakeScope, { buffer: 5 });
                    });
                    waits(5);
                    runs(function() {
                        expect(bossFiredFn).not.toHaveBeenCalled();
                    });
                });
            });

            describe("remove a listener when a delayed handler hasn't fired yet", function() {
                it("should never call the handler", function() {
                    runs(function() {
                        boss.addListener("fired", bossFiredFn, fakeScope, { delay: 5 });
                        boss.fireEvent("fired");
                        boss.removeListener("fired", bossFiredFn, fakeScope, { buffer: 5 });
                    });
                    waits(5);
                    runs(function() {
                        expect(bossFiredFn).not.toHaveBeenCalled();
                    });
                });
            });

            it("should continue to fire events after removing a non-existent event", function() {
                boss.addListener('fired', bossFiredFn);
                boss.fireEvent('fired');
                boss.removeListener('fired', Ext.emptyFn);
                boss.fireEvent('fired');
                expect(bossFiredFn.callCount).toBe(2);
            });

            it("should complain if the named method does not exist on the scope object", function() {
                var foo = new Observable(),
                    scope = {};

                expect(function() {
                    foo.addListener('bar', 'onBar', scope);
                }).toThrow("No method named 'onBar' found on scope object");
            });
        });

        describe("hasListener", function() {
            it("should return true if the observable has a listener on a particular event", function() {
                expect(boss.hasListener("ask_salary_augmentation")).toBe(true);
            });

            it("should normalize the case", function() {
                expect(boss.hasListener("ASK_salary_augmentation")).toBe(true);
            });

            it("should return false if the observable has no listener on a particular event", function() {
                expect(boss.hasListener("fired")).toBe(false);
            });
        });

        describe("fireAction", function() {
            var result, o, scope, actionArgs, handlerArgs;

            beforeEach(function() {
                result = [];
                o = new Observable();
                o.on('foo', function() {
                    handlerArgs = arguments;
                    result.push(1);
                });
                o.on('foo', function() {
                    result.push(2);
                });
            });

            function actionFn() {
                scope = this;
                actionArgs = arguments;
                result.push('action');
            }

            it("should call the action fn before the handlers", function() {
                o.fireAction('foo', null, actionFn);

                expect(result).toEqual(['action', 1, 2]);
            });

            it("should call the action fn before the handlers if order is 'before'", function() {
                o.fireAction('foo', null, actionFn, null, null, 'before');

                expect(result).toEqual(['action', 1, 2]);
            });

            it("should call the action fn after the handlers if order is 'after'", function() {
                o.fireAction('foo', null, actionFn, null, null, 'after');

                expect(result).toEqual([1, 2, 'action']);
            });

            describe("with a 'before' and 'after' handler", function() {
                beforeEach(function() {
                    o.on({
                        foo: function() {
                            result.push(0);
                        },
                        order: 'before'
                    });

                    o.on({
                        foo: function() {
                            result.push(3);
                        },
                        order: 'after'
                    });
                });

                it("should call the action fn after the 'before' handler", function() {
                    o.fireAction('foo', null, actionFn);

                    expect(result).toEqual([0, 'action', 1, 2, 3]);
                });

                it("should call the action fn after the 'before' handler if order is 'before'", function() {
                    o.fireAction('foo', null, actionFn, null, null, 'before');

                    expect(result).toEqual([0, 'action', 1, 2, 3]);
                });

                it("should call the action fn before the 'after' handler if order is 'after'", function() {
                    o.fireAction('foo', null, actionFn, null, null, 'after');

                    expect(result).toEqual([0, 1, 2, 'action', 3]);
                });
            });

            describe("if a handler returns false", function() {
                beforeEach(function() {
                    o.on('foo', function() {
                        result.push(3);

                        return false;
                    });
                });

                it("should call the action fn", function() {
                    o.fireAction('foo', null, actionFn);

                    expect(result).toEqual(['action', 1, 2, 3]);
                });

                it("should call the action fn if order is 'before'", function() {
                    o.fireAction('foo', null, actionFn, null, null, 'before');

                    expect(result).toEqual(['action', 1, 2, 3]);
                });

                it("should not call the action fn if order is 'after'", function() {
                    o.fireAction('foo', null, actionFn, null, null, 'after');

                    expect(result).toEqual([1, 2, 3]);
                });
            });

            it("should use the observable instance as the default scope for the action fn", function() {
                o.fireAction('foo', null, actionFn);
                expect(scope).toBe(o);
            });

            it("should call the action fn with the passed scope", function() {
                o.fireAction('foo', null, actionFn, fakeScope);

                expect(scope).toBe(fakeScope);
            });

            it("should call the action fn with the passed arguments", function() {
                o.fireAction('foo', ['a', 'b', 'c'], actionFn);

                expect(actionArgs.length).toBe(4);
                expect(actionArgs[0]).toBe('a');
                expect(actionArgs[1]).toBe('b');
                expect(actionArgs[2]).toBe('c');
            });

            it("should call the handlers with the passed arguments", function() {
                o.fireAction('foo', ['a', 'b', 'c'], actionFn);

                expect(handlerArgs.length).toBe(3);
                expect(handlerArgs[0]).toBe('a');
                expect(handlerArgs[1]).toBe('b');
                expect(handlerArgs[2]).toBe('c');
            });

            it("should not call the action fn on next fire (it should remove the single listener)", function() {
                var actionFn = jasmine.createSpy();

                o.fireAction('foo', null, actionFn);

                expect(actionFn.callCount).toBe(1);

                o.fireEvent('foo');

                expect(actionFn.callCount).toBe(1);
            });
        });

        describe("setListeners", function() {
            it("should be an alias for addListener", function() {
                var o = new Observable(),
                    listeners = {
                        foo: 'onFoo'
                    };

                spyOn(o, 'addListener');

                o.setListeners(listeners);

                expect(o.addListener).toHaveBeenCalledWith(listeners);
            });
        });

        describe("args", function() {
            it("should append the firing args to the event option args", function() {
                var foo = new Observable(),
                    handler = function() {
                        args = arguments;
                    },
                    opts = {
                        bar: handler,
                        args: [1, 2, 3]
                    },
                    args;

                foo.on(opts);

                foo.fireEvent('bar', 4, 5);

                expect(args).toEqual([1, 2, 3, 4, 5, opts]);
            });
        });

        describe("alias", function() {
            it("should alias addListener with on", function() {
                spyOn(Observable.prototype, 'addListener');

                Observable.prototype.on();

                expect(Observable.prototype.addListener).toHaveBeenCalled();
            });

            it("should alias removeListener with un", function() {
                spyOn(Observable.prototype, 'removeListener');

                Observable.prototype.un();

                expect(Observable.prototype.removeListener).toHaveBeenCalled();
            });

            it("should alias addManagedListener with mon", function() {
                spyOn(Observable.prototype, 'addManagedListener');

                Observable.prototype.mon();

                expect(Observable.prototype.addManagedListener).toHaveBeenCalled();
            });

            it("should alias removeManagedListener with mun", function() {
                spyOn(Observable.prototype, 'removeManagedListener');

                Observable.prototype.mun();

                expect(Observable.prototype.removeManagedListener).toHaveBeenCalled();
            });

            it("should alias observe with observeClass for retro compatibility", function() {
                expect(Observable.observeClass).toEqual(Observable.observe);
            });
        });

        describe("capture/release", function() {
            var capturer;

            beforeEach(function() {
                spyOn(Ext.Function, "createInterceptor").andCallThrough();
                capturer = jasmine.createSpy('capturer');
                Observable.capture(boss, capturer, fakeScope);
            });

            afterEach(function() {
                Observable.releaseCapture(boss);
            });

            describe("capture", function() {
                it("should create an interceptor of observable fireEventArgs method", function() {
                    expect(Ext.Function.createInterceptor).toHaveBeenCalled();
                });
            });

            describe("capturer", function() {
                it("should have the same signature as fireEvent", function() {
                    boss.fireEvent('foo', 'bar', 'baz');

                    expect(capturer).toHaveBeenCalledWith('foo', 'bar', 'baz');
                });
            });

            describe("release", function() {
                beforeEach(function() {
                    Observable.releaseCapture(boss);
                });

                it("should restore the original fireEvent function", function() {
                    expect(boss.fireEventArgs).toEqual(Observable.prototype.fireEventArgs);
                });

            });
        });

        describe("observe", function() {
            var firedListener,
                firedListener2,
                boss1,
                boss2;

            beforeEach(function() {
                firedListener = {
                    fn: bossFiredFn,
                    scope: fakeScope
                };
                firedListener2 = {
                    fn: bossFired2Fn,
                    scope: fakeScope
                };
                Observable.observe(Boss, {
                    fired: firedListener
                });

                boss1 = new Boss();
                boss2 = new Boss();

                if (boss1.hasListeners.fired) {
                    boss1.fireEvent("fired", "You're Fired! (boss 1)");
                }

                if (boss2.hasListeners.fired) {
                    boss2.fireEvent("fired", "You're Fired! (boss 2)");
                }

                // now listen on both the instance and the class
                boss1.on({
                    fired: firedListener2
                });

                if (boss1.hasListeners.fired) {
                    boss1.fireEvent("fired", "You're Fired! (boss 3)");
                }

                // now remove the instance listener and fire again
                boss1.un('fired', bossFired2Fn, fakeScope);

                if (boss1.hasListeners.fired) {
                    // this one should only go to the class listener
                    boss1.fireEvent("fired", "You're Fired! (boss 4)");
                }

                Boss.un('fired', bossFiredFn, fakeScope);
            });

            afterEach(function() {
                Boss.un('fired', firedListener);
                Observable.releaseCapture(Boss);
            });

            it("should call bossFiredFn several times", function() {
                expect(bossFiredFn.callCount).toEqual(4);
            });

            it("should call bossFired2Fn", function() {
                expect(bossFired2Fn.callCount).toEqual(1);
            });

            it("should have no listeners on instances", function() {
                expect(boss1.hasListeners.fired).toBeFalsy();
                expect(boss2.hasListeners.fired).toBeFalsy();
            });

            describe("first event firing", function() {
                var call;

                beforeEach(function() {
                    call = bossFiredFn.calls[0];
                });

                it("should execute handler with the correct scope", function() {
                    expect(call.object).toBe(fakeScope);
                });

                it("should execute handler with desired params", function() {
                    expect(call.args).toEqual(["You're Fired! (boss 1)", firedListener]);
                });
            });

            describe("second event firing", function() {
                var call;

                beforeEach(function() {
                    call = bossFiredFn.calls[1];
                });

                it("should execute handler with the correct scope", function() {
                    expect(call.object).toBe(fakeScope);
                });

                it("should execute handler with desired params", function() {
                    expect(call.args).toEqual(["You're Fired! (boss 2)", firedListener]);
                });
            });

            describe("third event firing", function() {
                var call;

                beforeEach(function() {
                    call = bossFiredFn.calls[2];
                });

                it("should execute handler with the correct scope", function() {
                    expect(call.object).toBe(fakeScope);
                });

                it("should execute handler with desired params", function() {
                    expect(call.args).toEqual(["You're Fired! (boss 3)", firedListener]);
                });
            });

            describe("third event firing to instance", function() {
                var call;

                beforeEach(function() {
                    call = bossFired2Fn.calls[0];
                });

                it("should execute handler with the correct scope", function() {
                    expect(call.object).toBe(fakeScope);
                });

                it("should execute handler with desired params", function() {
                    expect(call.args).toEqual(["You're Fired! (boss 3)", firedListener2]);
                });
            });

            describe("fourth event firing", function() {
                var call;

                beforeEach(function() {
                    call = bossFiredFn.calls[3];
                });

                it("should execute handler with the correct scope", function() {
                    expect(call.object).toBe(fakeScope);
                });

                it("should execute handler with desired params", function() {
                    expect(call.args).toEqual(["You're Fired! (boss 4)", firedListener]);
                });
            });
        });

        /*
         * Below is a rough sketch of the class hierarchy we generate here. The idea is to
         * generate all direct combinations of mixins and extends from Observable. The names
         * generated are similar to molecular names, e.g., "EM2E2O" expands into "a class that
         * (E)xtends a class which (M)ixins a class which (M)ixins a class that (E)xtends a
         * class that (E)xtends (O)bservable".
         *
         *
         *                      M3O <---- M2O <---- MO <---- Observable
         *                       ^          ^        ^            ^
         *                       |          |        |            |
         *          MEM3O <--- EM3O       EM2O       |           EO
         *            ^                     ^        |
         *            |                     |        |
         *          EMEM3O    ME2M2O <--- E2M2O      |
         *                       ^                   |
         *                       |                   |
         *                   EME2M2O                 |
         *                                           |
         *                    M2EMO <---- MEMO <--- EMO
         *                                  ^
         *                                  |
         *                   MEMEMO <---- EMEMO
         *
         * It should be noted that this does not cover the "dreaded diamond" structure, where
         * a class appears multiple times. This can happen using mixins.
         */
        describe("using mixin and extend in combination", function() {
            // an array of objects created by makeEntry:
            var classes;

            // Prepends a 'M' or 'E' to a given string ("to") following the pattern above.
            function prepend(c, to) {
                var d, s;

                if (to.charAt(0) === c) {
                    d = parseInt(to.charAt(1), 10); // look for "E#..."

                    if (d) {
                        s = c + (d + 1) + to.substring(2);
                    }
                    else {
                        s = c + '2' + to.substring(1);
                    }
                }
                else {
                    s = c + to;
                }

                return s;
            }

            function makeEntry(baseEntry, prefix) {
                var nameCap = prepend(prefix, baseEntry.name), // ex: "E2MO"
                    name = nameCap.toLowerCase(), // "e2mo"
                    entry = {
                        // T: class,  <-- added by declare() below
                        base: baseEntry,
                        fullName: 'spec.observable.' + nameCap,
                        name: nameCap,
                        lowerName: name,
                        events: baseEntry.events.concat([name])
                    };

                return entry;
            }

            // Makes derived classes from the given base and recurses to specified depth. This
            // method declares a derived class from the base and a class that uses the base as
            // a mixin.
            function declare(baseEntry, depth) {
                var entryE = makeEntry(baseEntry, 'E');

                Ext.define(entryE.fullName, {
                    extend: baseEntry.T,
                    constructor: function() {
                        this.callParent(arguments);
                    }
                });

                var mixins = {},
                    entryM = makeEntry(baseEntry, 'M');

                mixins[baseEntry.lowerName] = baseEntry.T;
                Ext.define(entryM.fullName, {
                    mixins: mixins,
                    constructor: function() {
                        this.mixins[baseEntry.lowerName].constructor.apply(this, arguments);
                    }
                });

                Observable.observe(entryE.T = spec.observable[entryE.name]);
                Observable.observe(entryM.T = spec.observable[entryM.name]);
                classes.push(entryE, entryM);

                if (depth) {
                    declare(entryE, depth - 1);
                    declare(entryM, depth - 1);
                }
            }

            beforeEach(function() {
                classes = [];
                // kick off the declarations with Observable as the base and go deep...
                declare({ T: Observable, name: 'O', events: [] }, 5);
            });

            afterEach(function() {
                Ext.Array.forEach(classes, function(cls) {
                    Ext.undefine(cls.fullName);
                });
                classes = null;
            });

            it('should prepare all classes', function() {
                Ext.Array.forEach(classes, function(entry) {
                    if (typeof entry.T.HasListeners !== 'function') {
                        expect(entry.fullName).toBe('prepared');
                    }
                });
            });

            // Ensure that all events declared for an instance fire poperly.
            it('should fire events on instances', function() {
                Ext.Array.forEach(classes, function(entry) {
                    Ext.Array.forEach(entry.events, function(event) {
                        var T = entry.T,
                            calls = 0,
                            listeners = {},
                            fn = function() {
                                ++calls;
                            };

                        listeners[event] = fn;
                        var obj = new T({ listeners: listeners });

                        // console.log('Firing ' + event + ' on ' + T.$className);
                        if (obj.hasListeners[event]) {
                            // the check is made to ensure that hasListeners is being populated
                            // correctly...
                            obj.fireEvent(event);
                        }

                        if (!calls) {
                            expect(T.$className + ' ' + event + ' event').toBe('fired');
                        }

                        obj.un(event, fn);

                        if (obj.hasListeners[event]) {
                            expect(T.$className + '.hasListeners.' + event).toBe('0 after');
                        }
                    });
                });
            });

            it('should fire events to all bases', function() {
                Ext.Array.forEach(classes, function(entry) {
                    var T = entry.T,
                        obj = new T(),
                        base;

                    // make sure that class listeners work on all bases for instances of each
                    // class...
                    for (base = entry.base; base; base = base.base) {
                        Ext.Array.forEach(base.events, function(event) {
                            var B = base.T,
                                calls = 0,
                                fn = function() {
                                    ++calls;
                                };

                            if (obj.hasListeners[event]) {
                                expect(T.$className + '.hasListeners.' + event).toBe('0 before');
                            }

                            // console.log('Firing '+event+' on '+B.$className+' via '+T.$className);
                            B.on(event, fn);

                            if (obj.hasListeners[event]) {
                                obj.fireEvent(event);
                            }

                            if (!calls) {
                                expect(T.$className + ' ' + event + ' event').toBe('fired');
                            }

                            B.un(event, fn);

                            if (obj.hasListeners[event]) {
                                expect(T.$className + '.hasListeners.' + event).toBe('0 after');
                            }
                        });
                    }
                });
            });
        }); // using mixin and extend in combination

        describe("listener merging", function() {
            var Sub, Cls, o, spy1, spy2, spy3;

            beforeEach(function() {
                spy1 = jasmine.createSpy();
                spy2 = jasmine.createSpy();
                spy3 = jasmine.createSpy();
            });

            function mixinCtor() {
                this.mixins.observable.constructor.apply(this, arguments);
            }

            afterEach(function() {
                spy1 = spy2 = spy3 = o = Sub = Cls = null;
            });

            describe("via mixin", function() {
                function makeCls(cfg) {
                    Cls = Ext.define(null, Ext.apply({
                        mixins: [Observable],
                        constructor: mixinCtor
                    }, cfg));
                }

                describe("direct mixin", function() {
                    it("should fire events with listeners only on the instance", function() {
                        makeCls();
                        o = new Cls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                    });

                    it("should fire events with listeners only on the class", function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o = new Cls();
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                    });

                    it("should fire events with listeners on the class & instance", function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o = new Cls({
                            listeners: {
                                foo: spy2
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });
                });

                describe("subclass of mixin", function() {
                    beforeEach(function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                    });

                    it("should fire events with listeners only on the instance", function() {
                        Sub = Ext.define(null, {
                            extend: Cls
                        });
                        o = new Sub({
                            listeners: {
                                foo: spy2
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });

                    it("should fire events with listeners only on the class", function() {
                        Sub = Ext.define(null, {
                            extend: Cls,
                            listeners: {
                                foo: spy2
                            }
                        });
                        o = new Sub();
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });

                    it("should fire events with listeners on the class & instance", function() {
                        Sub = Ext.define(null, {
                            extend: Cls,
                            listeners: {
                                foo: spy2
                            }
                        });
                        o = new Sub({
                            listeners: {
                                foo: spy3
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                        expect(spy3).toHaveBeenCalled();
                    });
                });
            });

            describe("via extend", function() {
                function makeCls(cfg) {
                    Cls = Ext.define(null, Ext.apply({
                        extend: Observable
                    }, cfg));
                }

                describe("direct subclass", function() {
                    it("should fire events with listeners only on the instance", function() {
                        makeCls();
                        o = new Cls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                    });

                    it("should fire events with listeners only on the class", function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o = new Cls();
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                    });

                    it("should fire events with listeners on the class & instance", function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                        o = new Cls({
                            listeners: {
                                foo: spy2
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });
                });

                describe("subclass of subclass", function() {
                    beforeEach(function() {
                        makeCls({
                            listeners: {
                                foo: spy1
                            }
                        });
                    });

                    it("should fire events with listeners only on the instance", function() {
                        Sub = Ext.define(null, {
                            extend: Cls
                        });
                        o = new Sub({
                            listeners: {
                                foo: spy2
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });

                    it("should fire events with listeners only on the class", function() {
                        Sub = Ext.define(null, {
                            extend: Cls,
                            listeners: {
                                foo: spy2
                            }
                        });
                        o = new Sub();
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                    });

                    it("should fire events with listeners on the class & instance", function() {
                        Sub = Ext.define(null, {
                            extend: Cls,
                            listeners: {
                                foo: spy2
                            }
                        });
                        o = new Sub({
                            listeners: {
                                foo: spy3
                            }
                        });
                        o.fireEvent('foo');
                        expect(spy1).toHaveBeenCalled();
                        expect(spy2).toHaveBeenCalled();
                        expect(spy3).toHaveBeenCalled();
                    });
                });
            });
        });

        describe("declarative listeners", function() {
            var ParentMixin, ChildMixin, ParentClass, ChildClass,
                result = [];

            beforeEach(function() {
                ParentMixin = Ext.define(null, {
                    mixins: [Observable],
                    type: 'ParentMixin',
                    listeners: {
                        foo: 'parentMixinHandler',
                        scope: 'this'
                    },
                    constructor: function(config) {
                        this.mixins.observable.constructor.call(this, config);
                    },

                    parentMixinHandler: function() {
                        result.push('parentMixin:' + this.id);
                    }
                });

                ChildMixin = Ext.define(null, {
                    extend: ParentMixin,
                    mixinId: 'childMixin',
                    type: 'ChildMixin',
                    listeners: {
                        foo: 'childMixinHandler',
                        scope: 'this'
                    },

                    childMixinHandler: function() {
                        result.push('childMixin:' + this.id);
                    }
                });

                ParentClass = Ext.define(null, {
                    mixins: [ChildMixin],
                    type: 'ParentClass',
                    listeners: {
                        foo: 'parentClassHandler',
                        scope: 'this'
                    },

                    constructor: function(config) {
                        this.mixins.childMixin.constructor.call(this, config);
                    },

                    parentClassHandler: function() {
                        result.push('parentClass:' + this.id);
                    }
                });

                ChildClass = Ext.define(null, {
                    extend: ParentClass,
                    type: 'ChildClass',
                    listeners: {
                        foo: 'childClassHandler',
                        scope: 'this'
                    },

                    childClassHandler: function() {
                        result.push('childClass:' + this.id);
                    }
                });

            });

            it("should call all the listeners", function() {
                var instance = new ChildClass({
                    listeners: {
                        foo: function() {
                            result.push('childInstance:' + this.id);
                        }
                    }
                });

                instance.id = 'theId';
                instance.fireEvent('foo');

                expect(result).toEqual([
                    'parentMixin:theId',
                    'childMixin:theId',
                    'parentClass:theId',
                    'childClass:theId',
                    'childInstance:theId'
                ]);
            });

            it("should not call addListener if extending and no listeners are declared", function() {
                var spy = jasmine.createSpy();

                var Cls = Ext.define(null, {
                    extend: Observable,
                    constructor: function(config) {
                        this.callParent(arguments);
                    },

                    addListener: spy
                });

                new Cls();
                expect(spy).not.toHaveBeenCalled();
            });

            it("should not call addListener if mixing in and no listeners are declared", function() {
                var spy = jasmine.createSpy();

                var Cls = Ext.define(null, {
                    mixins: [
                        Observable
                    ],

                    constructor: function(config) {
                        this.mixins.observable.constructor.apply(this, arguments);
                    },

                    addListener: spy
                });

                new Cls();
                expect(spy).not.toHaveBeenCalled();
            });

            describe("with options", function() {
                var Cls, spy;

                function defineCls(listeners) {
                    Cls = Ext.define(null, {
                        mixins: [
                            Observable
                        ],

                        constructor: function(config) {
                            this.mixins.observable.constructor.apply(this, arguments);
                        },

                        listeners: listeners,

                        trigger: function() {
                            this.fireEvent('foo');
                        }
                    });
                }

                beforeEach(function() {
                    spy = jasmine.createSpy();
                });

                afterEach(function() {
                    spy = Cls = null;
                });

                it("should default the scope to the class when specifying no scope & a function when using single: true", function() {
                    defineCls({
                        foo: {
                            single: true,
                            fn: spy
                        }
                    });
                    var o = new Cls();

                    o.trigger();
                    expect(spy.mostRecentCall.object).toBe(o);
                });

                it("should default the scope to the class when specifying no scope & a function when using delay", function() {
                    defineCls({
                        foo: {
                            delay: 1,
                            fn: spy
                        }
                    });
                    var o = new Cls();

                    o.trigger();
                    waitsFor(function() {
                        return spy.callCount > 0;
                    }, "Function never called");
                    runs(function() {
                        expect(spy.mostRecentCall.object).toBe(o);
                    });
                });

                it("should default the scope to the class when specifying no scope & a function when using buffer", function() {
                    defineCls({
                        foo: {
                            buffer: 1,
                            fn: spy
                        }
                    });
                    var o = new Cls();

                    o.trigger();
                    waitsFor(function() {
                        return spy.callCount > 0;
                    }, "Function never called");
                    runs(function() {
                        expect(spy.mostRecentCall.object).toBe(o);
                    });
                });
            });
        });

        describe('fireEventedAction', function() {
            var C;

            var after, before, fooArgs, fooRet;

            var fooPause;

            beforeEach(function() {
                before = after = fooArgs = fooRet = null;
                fooPause = false;

                C = Ext.define(null, {
                    mixins: [Observable],

                    constructor: function() {
                        this.mixins.observable.constructor.call(this);
                    },

                    doFoo: function(a, b, controller) {
                        fooArgs = Ext.Array.slice(arguments);

                        if (fooPause) {
                            controller.pause();
                        }

                        return fooRet;
                    },

                    foo: function(a, b) {
                        this.fireEventedAction('foo', [this, a, b], 'doFoo', this, false);
                    }
                });
            });

            it('should fire events before and after the action', function() {
                var c = new C();

                c.on({
                    blurp: 42,

                    beforefoo: function(sender, a, b) {
                        expect(fooArgs).toBe(null);
                        before = Ext.Array.slice(arguments);
                    },

                    foo: function(sender, a, b) {
                        expect(fooArgs).not.toBe(null);
                        after = Ext.Array.slice(arguments);
                    }
                });

                c.foo(2, 4);

                expect(before.length).toBe(5); // sender, a, b, controller, options
                expect(before[0] === c).toBe(true);
                expect(before[1]).toBe(2);
                expect(before[2]).toBe(4);
                expect(typeof before[3].pause).toBe('function');
                expect(before[4].blurp).toBe(42);

                expect(fooArgs.length).toBe(3);
                expect(fooArgs[0]).toBe(2);
                expect(fooArgs[1]).toBe(4);
                expect(typeof fooArgs[2].pause).toBe('function');

                expect(after.length).toBe(4); // sender, a, b, options
                expect(after[0] === c).toBe(true);
                expect(after[1]).toBe(2);
                expect(after[2]).toBe(4);
                expect(after[3].blurp).toBe(42);
            });

            it('should allow before events to prevent action', function() {
                var c = new C();

                c.on({
                    blurp: 42,

                    beforefoo: function(sender, a, b) {
                        expect(fooArgs).toBe(null);
                        before = Ext.Array.slice(arguments);

                        return false;
                    },

                    foo: function(sender, a, b) {
                        expect(fooArgs !== null).toBe(true);
                        after = Ext.Array.slice(arguments);
                    }
                });

                c.foo(2, 4);

                expect(fooArgs).toBe(null); // we returned false
                expect(after).toBe(null);

                expect(before.length).toBe(5); // sender, a, b, controller, options
                expect(before[0] === c).toBe(true);
                expect(before[1]).toBe(2);
                expect(before[2]).toBe(4);
                expect(typeof before[3].pause).toBe('function');
                expect(before[4].blurp).toBe(42);
            });

            it('should allow action to prevent events', function() {
                var c = new C();

                c.on({
                    blurp: 42,

                    beforefoo: function(sender, a, b) {
                        expect(fooArgs).toBe(null);
                        before = Ext.Array.slice(arguments);
                    },

                    foo: function(sender, a, b) {
                        expect(fooArgs !== null).toBe(true);
                        after = Ext.Array.slice(arguments);
                    }
                });

                fooRet = false;
                c.foo(2, 4);

                expect(fooArgs !== null).toBe(true);
                expect(after).toBe(null); // doFoo returned false

                expect(before.length).toBe(5); // sender, a, b, controller, options
                expect(before[0] === c).toBe(true);
                expect(before[1]).toBe(2);
                expect(before[2]).toBe(4);
                expect(typeof before[3].pause).toBe('function');
                expect(before[4].blurp).toBe(42);
            });

            it('should allow pausing of action and events', function() {
                var c = new C();

                c.on({
                    blurp: 42,

                    beforefoo: function(sender, a, b, controller) {
                        expect(fooArgs).toBe(null);
                        before = Ext.Array.slice(arguments);
                        controller.pause();
                    },

                    foo: function(sender, a, b) {
                        expect(fooArgs !== null).toBe(true);
                        after = Ext.Array.slice(arguments);
                    }
                });

                c.foo(2, 4);

                expect(fooArgs).toBe(null);
                expect(after).toBe(null);

                expect(before.length).toBe(5); // sender, a, b, controller, options
                expect(before[0] === c).toBe(true);
                expect(before[1]).toBe(2);
                expect(before[2]).toBe(4);
                expect(typeof before[3].pause).toBe('function');
                expect(before[4].blurp).toBe(42);

                fooPause = true; // tell doFoo action to pause controller
                before[3].resume();

                // Ensure doFoo was called
                expect(fooArgs.length).toBe(3);
                expect(fooArgs[0]).toBe(2);
                expect(fooArgs[1]).toBe(4);
                expect(typeof fooArgs[2].pause).toBe('function');

                // But foo event was not fired
                expect(after).toBe(null);

                // Now resume to finish
                before[3].resume();

                expect(after.length).toBe(4); // sender, a, b, options
                expect(after[0] === c).toBe(true);
                expect(after[1]).toBe(2);
                expect(after[2]).toBe(4);
                expect(after[3].blurp).toBe(42);
            });
        });

        describe("destroy", function() {
            it("should hook the clearListeners method on destroy when used as a mixin", function() {
                var Foo = Ext.define(null, {
                        mixins: [Observable],
                        constructor: function() {
                            this.mixins.observable.constructor.call(this);
                        }
                    }),
                    foo = new Foo();

                var clearSpy = spyOn(foo, 'clearListeners').andCallThrough();

                foo.destroy();

                expect(clearSpy).toHaveBeenCalled();
            });
        });

        describe('removing buffered listeners while the event is being fired', function() {
            var success,
                source;

            afterEach(function() {
                Ext.destroy(source);
            });

            it('should not throw an error', function() {
                expect(function() {
                    var secondListenerFn = function() {},
                        secondListenerScope = {},
                        secondlisteners;

                    source = new Ext.util.Observable();

                    source.on('test', function() {
                        // Remove the second (buffered) listener during the
                        // event fire.
                        // This clears the listener's task property.
                        secondlisteners.destroy();
                    });
                    secondlisteners = source.on({
                        test: secondListenerFn,
                        scope: secondListenerScope,
                        buffer: 50,
                        destroyable: true
                    });
                    source.on('test', function() {
                        success = true;
                    });

                    source.fireEvent('test');

                    // Event firing sequence must have completed.
                    expect(success).toBe(true);
                }).not.toThrow();
            });
        });

        describe('onFrame option', function() {
            it('should call the handler in an animationFrameListener', function() {
                var b = new Boss(),
                    spy = spyOnEvent(b, 'newevent', null, {
                        onFrame: true
                    });

                b.fireEvent('newevent', 1);
                b.fireEvent('newevent', 2);

                // Does not call handler immediately
                expect(spy).not.toHaveBeenCalled();

                waitsForSpy(spy);

                // Multiple calls before the animation frame.
                // Only the last one wins, as documented.
                runs(function() {
                    expect(spy.callCount).toBe(1);
                    expect(spy.mostRecentCall.args[0]).toBe(2);
                });
            });
        });
    });

}

makeObservableSuite(true);
makeObservableSuite(false);

})();
