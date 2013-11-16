/** @author Wickers Mathieu
*/

var cp = require("colorplus");
var oldLog = console.log;
var date = new Date();
var today = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + "|";

console.log = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(cp.blue,today,cp.r); //set the blue color before the date and then set the default color 
  oldLog.apply(console, args);
};

console.header = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(cp.blue,today,cp.green);
  args.push(cp.r);
  oldLog.apply(console, args);
};

console.error = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(cp.blue,today,cp.red);
  args.push(cp.r);
  oldLog.apply(console, args);
};

console.info = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(cp.blue,today,cp.gray);
  args.push(cp.r);
  oldLog.apply(console, args);
};

module.exports = console;