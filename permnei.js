"use strict";
/* This program adds users to NEI permissions using PermissionsEx's "permissions.yml" file, using a template NEI "server.cfg" file.
 * To do so, it uses a "bits" system, in which each bit acts like a switch to enable/disable various permissions for each group.
 * Both of those files need tweaking in order for this program to do anything. Each group in "permissions.yml" should have a "nei"
 * key inside of the "options" key. In addition, the base "server.cfg", which this program then fills, should have "#i" at the end
 * of each line, where "i" equals the bit that enables/disables that feature. This means having a separate base file is a must.
 */
const bits = 8;							// Number of option bits to use.
const defp = "00000000";				// Default permissions, should the "nei" key be missing in PermissionsEx config file.
const pexf = "./permissions.yml";		// Location of PermissionsEx permissions.yml file. This program does NOT modify this file.
const neid = "./server-baseconfig.cfg";	// Location of NEI server.cfg base file. This program does NOT modify this file.
const outp = "./server.cfg";			// Location of server.cfg file. This file WILL be overwritten on each run.

const yaml = require("js-yaml");
const fs   = require("fs");
var permissions;
var config;
var gname = [];
var gperm = [];
var users = [];
var ustrg = [];
for (var i = 0; i < bits; i++) {
	users[i] =  [];
	ustrg[i] =  [];
}

try {
    permissions = yaml.safeLoad(fs.readFileSync(pexf, "utf8"));
    config = fs.readFileSync(neid, "utf8");
    var i = 0
    for (var key in permissions.groups) {
		if (permissions.groups.hasOwnProperty(key)) {
			var obj = permissions.groups[key];
			gname[i] = key;
			gperm[i] = ("nei" in obj.options ? obj.options.nei : defp);
			console.log(key+": "+obj.options.nei);
			i++;
		}
	}
	for (var key in permissions.users) {
		if (permissions.users.hasOwnProperty(key)) {
			var obj = permissions.users[key];
			if (("options" in obj) && ("name" in obj.options) && ("group" in obj)) {
				for (var j = 0; j < obj.group.length; j++) {
					if (gname.indexOf(obj.group[j]) != -1) {
						for (var k = 0; k < bits; k++) {
							if (gperm[gname.indexOf(obj.group[j])][k] == 1 && users[k].indexOf(obj.options.name) == -1) {
								users[k][users[k].length] = obj.options.name;
							}
						}
					}
				}
			}
		}
	}
	for (var i = 0; i < bits; i++) {
		ustrg[i] = ", "+JSON.stringify(users[i]).replace(/"|\[|\]/g, "").replace(/,/g, ", ");
		config = config.replace(new RegExp("#"+i, "g"), ustrg[i]);
	}
	fs.writeFileSync(outp, config, "utf-8");
	console.log(config);
} catch (e) {console.log(e);}
