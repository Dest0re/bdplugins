var cl = {};
var untrustedRoles = [
    "638442776895291403",
    "645608344681316352",
    "645637013428764673",
    "662712802326347826"
];
var isClownLength = +[[+!+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]]];
var isTrustedLength = +[[!+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[] + !+[] + !+[]] + [!+[] + !+[] + !+[] + !+[] + !+[]]];

cl.warn = (message) => { return BdApi.showToast(message, { type: "warning" }); };
cl.error = (message) => { return BdApi.showToast(message, { type: "error" }); };
cl.MissingPermissionsError = class MissingPermissionsError extends Error {
    constructor(message = "У тебя недостаточно прав на использование этого плагина!", ...args) {
        super(message, ...args);
        cl.error(message);
    }
};
cl.OutdatedBDVersionError = class OutdatedBDVersionError extends Error {
    constructor(message = "У тебя BD старый, никаких тебе клоунских плагинов", ...args) {
        super(message, ...args);
        cl.error(message);
    }
};
cl.ViolationDetected = class ViolationDetected extends Error {
    constructor(message="Ну и охуел же ты", ...args){
        super(message, ...args);
        cl.error(message);
    }
}
if (!BdApi.findModule) throw new cl.OutdatedBDVersionError();
cl.cancel = [];
cl.onSendMessage = {};
cl.cancelPreviousOnSubmit = () => { };
cl.______selfDestruct = function (error) {
    for (var i in this.cancel) {
        this.cancel[i];
    }
    this.cancelPreviousOnSubmit();
    window.clownLib = undefined;
    if(error) throw new error();
};
cl.isClown = () => {
    return BdApi.findModuleByProps("getMember").getMember("584321061437571072", BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id) ? true : false;
};
cl.isTrusted = function () {
    if (this.isClown()) {
        return true;
    }
    var member = BdApi.findModuleByProps("getMember").getMember("625032816576561170", BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id);
    if (member && member.roles) {
        for (var i in untrustedRoles) {
            if (member.roles.includes(untrustedRoles[i])) {
                member = undefined;
                break;
            }
        }
    }
    return member ? true : false;
};
cl.cancel.push(BdApi.monkeyPatch(BdApi.findModuleByProps("sendMessage"), "sendMessage", {
    before: (a) => {
        if (window.clownLib.isClown.toString().length == isClownLength
            || window.clownLib.isTrusted.toString().length == isTrustedLength) {
            var content = a.methodArguments[1].content;
            for (var i in window.clownLib.onSendMessage) {
                content = window.clownLib.onSendMessage[i](content) || content;
            }
            a.methodArguments[1].content = content;
        } else {
            window.clownLib.______selfDestruct(window.clownLib.ViolationDetected);
        }
    }
}));
cl.addSubmitListener = function (pluginName, callback) {
    this.onSendMessage[pluginName] = callback;
};
cl.removeSubmitListener = function (pluginName) {
    delete this.onSendMessage[pluginName];
};
window.clownLib = cl;
BdApi.showToast("Клоунская библиотека на месте");