var _a;
import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo managed workflow\n';
const NativeBDK = (_a = NativeModules === null || NativeModules === void 0 ? void 0 : NativeModules.BdkModule) !== null && _a !== void 0 ? _a : new Proxy({}, {
    get() {
        throw new Error(LINKING_ERROR);
    },
});
export class BdkClient {
    constructor() {
        this._bdk = NativeBDK;
        this._bdk = NativeBDK;
    }
}
//# sourceMappingURL=BdkClient.js.map