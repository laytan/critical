const Critical_Public = require('../../src/public/js/class-critical-public');

describe("Critical_Public", () => {
    test("Critical_Public object can get created", () => {
        const CriticalPublic = new Critical_Public(function () { });
        expect(1 + 1).toBe(2);
    });

    describe("getAllStylesheets", () => {
        test("calls toArray on the JQuery collection", () => {
            const CriticalPublic = new Critical_Public((selector) => {
                return {
                    toArray: () => {
                        return "pass";
                    }
                }
            });

            expect(CriticalPublic.getAllStylesheets()).toBe("pass");
        });
    });

    describe("isNotAdminStylesheet", () => {
        test("Returns false when the string 'admin' is present in the middle of href", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "blaaldsadadminsadaf" });
            expect(res).toBe(false);
        });

        test("Returns false when the string 'admin' is present in the beginning of href", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "adminblaaldsadaasdinsadaf" });
            expect(res).toBe(false);
        });

        test("Returns false when the string 'admin' is present in the end of href", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "blaaldsaddinsadafadmin" });
            expect(res).toBe(false);
        });

        test("Returns false when the string 'admin' is present in href", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.isNotAdminStylesheet({ href: "admin" });
            expect(res).toBe(false);
        });
    });

    describe("getHiddenInformation", () => {
        test("Returns redirectTo element", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: (selector) => {
                        return {
                            text: () => {
                                return "pass";
                            }
                        };
                    }
                }
            )
            expect(res.redirectTo).toBe("pass");
        });

        test("Returns nonce element", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: (selector) => {
                        return {
                            text: () => {
                                return "pass";
                            }
                        };
                    }
                }
            )
            expect(res.nonce).toBe("pass");
        });

        test("Returns postID element", () => {
            const CriticalPublic = new Critical_Public(function () { });
            const res = CriticalPublic.getHiddenInformation(
                {
                    find: (selector) => {
                        return {
                            text: () => {
                                return "pass";
                            }
                        };
                    }
                }
            )
            expect(res.postID).toBe("pass");
        });
    });
});