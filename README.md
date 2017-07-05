# permNEI
PermissionsEx to NEI config bridge.

Needs "js-yaml" to work.

This program adds users to NEI permissions using PermissionsEx's "permissions.yml" file, using a template NEI "server.cfg" file. To do so, it uses a "bits" system, in which each bit acts like a switch to enable/disable various permissions for each group. Both of those files need tweaking in order for this program to do anything. Each group in "permissions.yml" should have a "nei" key inside of the "options" key. In addition, the base "server.cfg", which this program then fills, should have "#i" at the end of each line, where "i" equals the bit that enables/disables that feature. This means having a separate base file is a must.
