#!/usr/bin/env node


/*
 * bin/css497-server-daemon.js
 * Code from Fardjad Davari
 */

//Everything above this line will be executed twice
require('daemon')();

var cluster = require('cluster');

var numCPUs = require('os').cpus().length;


/*
 * Creates new worker when running as cluster master.
 * Runs the HTTP server otherwise/
 */

function createWorker() {
	if(cluster.isMaster){
		//Fork worker if running as cluster master
		var child = cluster.fork();

		//Respawn the child process after exit
		//ex. incase of uncaught exception
		child.on('exit', function (code, signal) {
			createWorker();
		});
	}else{
		//Run HTTP server if running as worker
		require('../lib/secure-health-app-server');
	}
}

/*
 * Creates the specifed number of workers.
 * @param {Number} n Number of workers to create.
 */

function createWorkers(n) {
	while (n-- > 0) {
		createWorker();
	}
}

/*
 * Kills all workers with the given signal.
 * Also removes all event listeners from workers before sending the signal
 * to prevent respawning.
 * @param {NUmber} signal
 */

function killAllWorkers(signal) {
	var uniqueID,
	     worker;
	
	for (uniqueID in cluster.workers) {
		if(cluster.workers.hasOwnProperty(uniqueID)) {
			worker = cluster.workers[uniqueID];
			worker.removeAllListerners();
			worker.process.kill(signal);
		}
	}
}

/*
 * Restarts the workers.
 */

process.on('SIGHUP', function () {
	killAllWorkers('SIGTERM');
	createWorkers(numCPUs * 2);
});

/*
 * Gracefull Shuts down the workers.
 */

process.on('SIGTERM', function () {
	killAllWorkers('SIGTERM');
});

//Create two children for each CPU
createWorkers(numCPUs * 2);

