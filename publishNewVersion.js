const { exec, execSync, spawnSync } = require('child_process');
const fs = require('fs');
const util = require('util');
const packageJson = require('./package.json');

/**
 * Program usage and arguments
 */
const getPublishTypeFromArgs = () => {
  if (process.argv.includes('--patch')) {
    return 'patch';
  } else if (process.argv.includes('--minor')) {
    return 'minor';
  } else if (process.argv.includes('--major')) {
    return 'major';
  }

  return null;
};

const getIsVerbose = () => {
  return process.argv.includes('--verbose');
};

const publishType = getPublishTypeFromArgs();
if (publishType === null) {
  console.log('Usage: publishNewVersion RELEASE_TYPE [OPTIONS]\n');
  console.log('RELEASE_TYPE: Choose what type of release you want to do. Patch, Minor or Major');
  console.log('\t--patch\t\tversion when you make backwards-compatible bug fixes');
  console.log('\t--minor\t\tversion when you add functionality in a backwards-compatible manner');
  console.log('\t--major\t\tversion when you make incompatible API changes');

  console.log('\nOPTIONS:');
  console.log('\t--verbose\tVerbose print to stdout');

  return;
}

/**
 * Program logging
 */
var logFile = fs.createWriteStream('publishNewVersion.log', { flags: 'w', autoClose: true });
const log = (message, verbose = true, ...args) => {
  if (verbose || getIsVerbose()) {
    process.stdout.write(util.format.apply(null, [message, ...args]) + '\n');
  }

  logFile.write(util.format.apply(null, [message, ...args]) + '\n');
};

/**
 * Program
 */

const handleExecErrors = error => {
  if (error) {
    if (error.error) {
      log(error.error.toString('utf8'), false);
    }

    if (error.stdout) {
      log(error.stdout.toString('utf8'), false);
    }

    if (error.stderr) {
      log(error.stderr.toString('utf8'), false);
    }
  }

  throw error;
};

const updateNewVersion = versionType => {
  const currentVersion = packageJson.version;
  log(`Current version in package.json: ${currentVersion}`);
  log(`Executing: yarn version --${versionType}`, true);

  try {
    const yarnVersion = execSync(`yarn version --${versionType}`);
    log(yarnVersion.toString('utf8'), false);

    const updatedPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const newVersion = updatedPackageJson.version;
    log('New version:', true, newVersion);

    return newVersion;
  } catch (error) {
    handleExecErrors(error);
  }
};

const buildNewVersion = () => {
  log('Building new release');
  try {
    const yarnBuild = execSync(`yarn build`);
    log(yarnBuild.toString('utf8'), false);
  } catch (error) {
    handleExecErrors(error);
  }
};

const publishVersion = newVersion => {
  log('Publishing new version to registry:', true, packageJson.publishConfig.registry);
  try {
    const yarnPublish = execSync(`yarn publish dist/ --new-version ${newVersion}`);
    log(yarnPublish.toString('utf8'), true);
  } catch (error) {
    handleExecErrors(error);
  }
};

const pushToOrigin = newVersion => {
  log('Pushing new version and tags');
  try {
    const push = execSync('git push');
    log(push.toString('utf8'), true);

    const pushTags = execSync(`git push origin v${newVersion}`);
    log(pushTags.toString('utf8'), true);
  } catch (error) {
    console.log("Couldn't push to origin, please run manually:");
    console.log('git push');
    console.log(`git push origin v${newVersion}`);

    handleExecErrors(error);
  }
};

revertNewVersion = newVersion => {
  log('ERROR - Reverting new version and commit');

  try {
    const deleteNewTag = execSync(`git tag -d v${newVersion}`);
    log(`Deleted tag v${newVersion}`);
    log(deleteNewTag.toString('utf8'), false);

    const resetHead = execSync('git reset HEAD~1');
    log(resetHead.toString('utf8'), false);
    log('Reverted commit');

    const checkoutPackageJson = execSync('git checkout package.json');
    log(checkoutPackageJson.toString('utf8'), false);
    log('Reverted changes in package.json');
  } catch (error) {
    handleExecErrors(error);
  }
};

// Make sure everything is commited before starting release
exec('git diff-index --quiet HEAD --', uncommitedChanges => {
  if (uncommitedChanges) {
    console.log('ERROR: You have uncommited changes! Please commit or stash them before proceeding!');
    return;
  }

  try {
    // Publish new version
    const newVersion = updateNewVersion(publishType);
    try {
      buildNewVersion();
      publishVersion(newVersion);
    } catch (error) {
      revertNewVersion(newVersion);
    }

    pushToOrigin(newVersion);

    console.log(`Done! New version ${newVersion} is available on ${packageJson.publishConfig.registry}`);
  } catch (exception) {
    logFile.end();
    logFile.on('finish', () => {
      throw exception;
    });
  }

  logFile.end();
});
