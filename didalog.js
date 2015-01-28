/**
 * @desc This lib (DIDALOG) is a wrapper for the browser's native debug logger
 * @author Tarik Čelik tarik.chelik@gmail.com
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
    supportsConsole: this.checkConsoleSupport(),
    defaultMessage: 'This is the default log message.Please enter your log message.',
    callbackFunction: '',

    /**
     * @desc This method does the actual logging
     * @param level
     * @param msg
     */
    log: function (level, msg) {
        level = !this.logLevels.contains(level) ? level : this.defaultLogLevel;
        msg = msg || this.defaultMessage;
        var logStringTemplate = this.setLogStringTemplate(level, msg);

        return this.checkConsoleSupport == true ? console.log((new Error).lineNumber + logStringTemplate)
                                                : alert(logStringTemplate);

    },

    /**
     * @desc This method check if the current browser has the console object
     * @returns {boolean}
     */
    checkConsoleSupport: function () {
        return typeof console == 'object' ? true : false;
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
    }
};