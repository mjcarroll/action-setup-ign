import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as process from 'process';

async function runAptGetInstall(packages: string[]): Promise<number> {
  return exec.exec(
    "sudo",
    ["DEBIAN_FRONTEND=noninteractive",
      "apt-get", "install", "--no-install-recommends", "--quiet",
      "--yes"].concat(packages)
  );
}

async function installPython3Dependencies(): Promise<number> {
  return exec.exec(
    "sudo",
    ["pip3", "install", "--upgrade",
      "colcon-common-extensions", "vcstool"]
  );
}

async function runLinux() {
  await exec.exec("sudo", ["apt-get", "update"]);

  // Enforce UTC time for consistency.
  await exec.exec("sudo", ["bash", "-c", "echo 'Etc/UTC' > /etc/timezone"]);
  await exec.exec(
      "sudo",
      ["ln", "-sf", "/usr/share/zoneinfo/Etc/UTC", "/etc/localtime"])
  await runAptGetInstall(["tzdata"]);
  await runAptGetInstall(
    ["build-essential", "clang", "cmake", "cppcheck", 
      "git", "lcov", "pkg-config", "wget",
      "python3-setuptools"]);
  await installPython3Dependencies();
}

async function run() {
  try {
    const platform = process.platform;
    if (platform === 'linux') {
      await runLinux();
    } else {
      core.setFailed(`unsupported platform ${platform}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
