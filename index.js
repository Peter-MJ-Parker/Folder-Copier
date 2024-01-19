const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');

const folderToMonitor = `path\\to\\folder-to-monitor`;
const externalHardDriveFolder = 'path\\to\\copied-folder';

const watcher = chokidar.watch(folderToMonitor, {
	// ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true,
});

console.log(`Monitoring folder: ${folderToMonitor}`);

watcher.on('all', (event, filePath) => {
	console.log(`${event} detected: ${filePath}`);

	const relativePath = path.relative(folderToMonitor, filePath);
	const destinationPath = path.join(externalHardDriveFolder, relativePath);

	fs.copy(filePath, destinationPath, () => {
		return console.log(`Copied ${filePath} to ${destinationPath}`);
	});
});

process.on('SIGINT', () => {
	console.log('Stopping item monitoring');
	watcher.close();
	process.exit();
});
