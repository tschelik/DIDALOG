/**
 * @desc This lib (DIDALOG) is a wrapper for the browser's native debug logger
 * @author Tarik Čelik tarik.chelik@gmail.com
 * @author Adnan Kukuljac adnankukuljac@gmail.com
 * @version 0.0 (Still under heavy development and is not expected to work)
 * @license Apache 2.0 http://www.apache.org/licenses/LICENSE-2.0
 * @usage
 *          var LOGGER = DIDALOG || {};
 *              LOGGER.log('info', 'This is my log message');
 */
DIDALOG = {
    logLevels: ['info', 'error', 'warning', 'debug'],
    defaultLogLevel: 'info',
    isDebug: true,
    defaultMessage: 'This is the default log message. Please enter your log message.',
    callbackFunction: '',
    datetime: true,
    defaultGroup: 'DIDALOG LOG',

    /**
     * @desc This method does the actual logging
     * @param level
     * @param msg
     */
    log: function (level, msg) {

        level = this.checkLevel(level) ? level : this.defaultLogLevel;
        msg = msg || this.defaultMessage;

        return this.checkConsoleSupport() == true ? this.translateLogLevel(level, this.logMsg(level, msg))
            : alert("Console not supported");

    },

    /**
     * @desc This method check if the current browser has the console object
     * @returns {boolean}
     */
    checkConsoleSupport: function () {
        return (window.console) ? true : false;
    },

    /**
     * @desc This method is used internally for generating the log message string
     * @param level
     * @param msg
     * @returns {string}
     */
    setLogStringTemplate: function (level, msg) {
        var replacements = {"%LEVEL%": level, "%MSG%": msg},
            str = '::[%LEVEL%] %MSG%';

        str = str.replace(/%\w+%/g, function (all) {
            return replacements[all] || all;
        });
    },

    /**
     This method writes msg on standard output (console)
     */
    logMsg: function (level, msg) {


        if (this.datetime) {
            var currentDate = new Date();
            var printDatetime = "Log time: " + currentDate.getDate() + "/"
                + (currentDate.getMonth() + 1) + "/"
                + currentDate.getFullYear() + " @ "
                + currentDate.getHours() + ":"
                + currentDate.getMinutes() + ":"
                + currentDate.getSeconds();
            return (level + ": " + msg + " " + printDatetime);
        }
        else
            return (level + ": " + msg);
    },

    translateLogLevel: function (level, msg) {

        if (this.lvltoNumber(level) == 0)
            return console.info(msg);
        else if (this.lvltoNumber(level) == 1)
            return console.error(msg);
        else if (this.lvltoNumber(level) == 2)
            return console.warn(msg);
        else if (this.lvltoNumber(level) == 3)
            return console.debug(msg);
    },

    /**
     This method returns index of specified level
     */
    lvltoNumber: function (level) {

        return this.logLevels.indexOf(level);
    },

    /**
     This method checks does level exists
     */
    checkLevel: function (level) {

        return (Array.apply(null, this.logLevels).indexOf(level) != -1)

    },

    /**
     This method will clear console output
     */
    clear: function () {
        return this.checkConsoleSupport() == true ? console.clear()
            : alert("Console not supported");
    },

    /**
     This method will start console group
     */
    groupLogStart: function (groupName) {
        msg = groupName || this.defaultGroup;

        return this.checkConsoleSupport() == true ? console.group("Logging '%s'", msg)
            : alert("Console not supported");
    },

    /**
     This method will end console group
     */
    groupLogEnd: function () {

        return this.checkConsoleSupport() == true ? console.groupEnd()
            : alert("Console not supported");
    }


};