"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function runAptGetInstall(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        return exec.exec("sudo", ["DEBIAN_FRONTEND=noninteractive",
            "apt-get", "install", "--no-install-recommends", "--quiet",
            "--yes"].concat(packages));
    });
}
function installPython3Dependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        return exec.exec("sudo", ["pip3", "install", "--upgrade",
            "colcon-common-extensions", "vcstool"]);
    });
}
function runLinux() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec("sudo", ["apt-get", "update"]);
        // Enforce UTC time for consistency.
        yield exec.exec("sudo", ["bash", "-c", "echo 'Etc/UTC' > /etc/timezone"]);
        yield exec.exec("sudo", ["ln", "-sf", "/usr/share/zoneinfo/Etc/UTC", "/etc/localtime"]);
        yield runAptGetInstall(["tzdata"]);
        yield runAptGetInstall(["build-essential", "clang", "cmake", "git", "wget"]);
        yield installPython3Dependencies();
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const platform = process.platform;
            if (platform === 'linux') {
                yield runLinux();
            }
            else {
                core.setFailed(`unsupported platform ${platform}`);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
