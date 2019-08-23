'use strict';

QUnit.module("Critical_Public", {}, function () {
    QUnit.test("Critical_Public object can get created", function (assert) {
        const CriticalPublic = new Critical_Public(function () { });
        assert.equal(1 + 1, 2);
    });
});