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

const getIsVerbrose = () => {
  return process.argv.includes('--verbrose');
};

const publishType = getPublishTypeFromArgs();
if (publishType === null) {
  console.log('Usage: publishNewVersion RELEASE_TYPE [OPTIONS]\n');
  console.log('RELEASE_TYPE: Choose what type of release you want to do. Patch, Minor or Major');
  console.log('\t--patch\t\tversion when you make backwards-compatible bug fixes');
  console.log('\t--minor\t\tversion when you add functionality in a backwards-compatible manner');
  console.log('\t--major\t\tversion when you make incompatible API changes');

  console.log('\nOPTIONS:');
  console.log('\t--verbrose\tVerbrose print to stdout');

  return;
}

/**
 * Program logging
 */
var logFile = fs.createWriteStream('publishNewVersion.log', { flags: 'w', autoClose: true });
const log = (message, verbrose = true, ...args) => {
  if (verbrose || getIsVerbrose()) {
    process.stdout.write(util.format.apply(null, [message, ...args]) + '\n');
  }

  logFile.write(util.format.apply(null, [message, ...args]) + '\n');
};

/**
 * Program
 */

const handleSpawnErrors = spanwSyncReturns => {
  if (spanwSyncReturns.error) {
    log(spanwSyncReturns.error);
    throw new Error(spanwSyncReturns.error);
  }

  if (spanwSyncReturns.stderr.byteLength > 0) {
    log(spanwSyncReturns.stderr.toString('utf8'));
    //throw new Error(spanwSyncReturns.stderr.toString('utf8'));
  }
};

const updateNewVersion = versionType => {
  const currentVersion = packageJson.version;
  log(`Current version in package.json: ${currentVersion}`);
  log(`Executing: yarn version --${versionType}`, true);

  const yarnVersion = spawnSync(`yarn`, [`version`, `--${versionType}`], { shell: true });
  handleSpawnErrors(yarnVersion);

  log(yarnVersion.stdout.toString('utf8'), false);

  const updatedPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const newVersion = updatedPackageJson.version;
  log('New version:', true, newVersion);
};

const buildNewVersion = () => {
  log('Building new release');
  const yarnBuild = spawnSync(`yarn`, [`build`], { shell: true });
  handleSpawnErrors(yarnBuild);
  log(yarnBuild.stdout.toString('utf8'), false);
};

const publishVersion = () => {
  const publishPackageJson = JSON.parse(fs.readFileSync('./dist/package.json', 'utf8'));
  log('Publishing new version to registry:', true, packageJson.publishConfig.registry);
  const yarnPublish = spawnSync(`yarn`, ['publish', 'dist/', '--new-version', publishPackageJson.version], {
    shell: true,
  });
  handleSpawnErrors(yarnPublish);
  log(yarnVersion.stdout.toString('utf8'), true);
};

const pushToOrigin = () => {
  log('Pushing new version and tags');
  const push = spawnSync('git', ['push'], {
    shell: true,
  });
  handleSpawnErrors(push);
  log(push.stdout.toString('utf8'), true);

  const newVersion = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  const pushTags = spawnSync('git', ['push', 'origin', `v${newVersion}`], {
    shell: true,
  });
  handleSpawnErrors(pushTags);
  log(pushTags.stdout.toString('utf8'), true);
};

// Make sure everything is commited before starting release
exec('git diff-index --quiet HEAD --', uncommitedChanges => {
  if (uncommitedChanges) {
    console.log('ERROR: You have uncommited changes! Please commit or stash them before proceeding!');
    return;
  }
  try {
    // Publish new version
    updateNewVersion(publishType);
    buildNewVersion();
    publishVersion();
    pushToOrigin();
    log('Done!');
  } catch (exception) {
    logFile.end();
    logFile.on('finish', () => {
      throw exception;
    });
  }

  logFile.end();
});
