'use strict';

const { module, test } = QUnit;

module("Critical_Public", {}, function () {
    test("Critical_Public object can get created", function (assert) {
        const CriticalPublic = new Critical_Public(function () { });
        assert.equal(1 + 1, 2);
    });

    module("getAllStylesheets", {}, function () {
        test("calls toArray on the JQuery collection", function (assert) {
            const CriticalPublic = new Critical_Public(function (selector) {
                return {
                    toArray: function () {
                        return "pass";
                    }
                }
            });

            assert.equal("pass", CriticalPublic.getAllStylesheets());
        });
    });

    module("isNotAdminStylesheet", function () {
        test("Returns false when the string 'admin' is present in the middle of href", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "blaaldsadadminsadaf" });
            assert.equal(res, false);
        });

        test("Returns false when the string 'admin' is present in the beginning of href", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "adminblaaldsadaasdinsadaf" });
            assert.equal(res, false);
        });

        test("Returns false when the string 'admin' is present in the end of href", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "blaaldsaddinsadafadmin" });
            assert.equal(res, false);
        });

        test("Returns false when the string 'admin' is present in href", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "admin" });
            assert.equal(res, false);
        });
    });

    module("getHiddenInformation", function () {
        test("Returns redirectTo element", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: function (selector) {
                        return {
                            text: function () {
                                return "pass";
                            }
                        };
                    }
                }
            )
            assert.equal("pass", res.redirectTo);
        });

        test("Returns nonce element", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: function (selector) {
                        return {
                            text: function () {
                                return "pass";
                            }
                        };
                    }
                }
            )
            assert.equal("pass", res.nonce);
        });

        test("Returns postID element", function (assert) {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: function (selector) {
                        return {
                            text: function () {
                                return "pass";
                            }
                        };
                    }
                }
            )
            assert.equal("pass", res.postID);
        });
    });
});