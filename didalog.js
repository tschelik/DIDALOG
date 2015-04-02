/**
 * @desc self lib (DIDALOG) is a wrapper for the browser's native debug logger
 * @author Tarik Čelik tarik.chelik@gmail.com
 * @author Adnan Kukuljac adnankukuljac@gmail.com
 * @version 1.0 (Beta)
 * @license Apache 2.0 http://www.apache.org/licenses/LICENSE-2.0
 * @usage
 *          var LOGGER = DIDALOG || {};
 *              LOGGER.log('info', 'self is my log message');
 */
DIDALOG = new function () {
    var self = this;

    self.logLevels = ['info', 'error', 'warning', 'debug'];
    self.defaultLogLevel = 'info';
    self.isDebug = true;
    self.defaultMessage = 'self is the default log message. Please enter your log message.';
    self.callbackFunction = '';
    self.datetime = true;
    self.defaultGroup = 'DIDALOG';
    self.didalogConsole = true; //if set to true external display will show up, to turn it off set to false
    self.didalogConsoleColors = ['#008000', '#B22222', 'FFCC00', '#F8F8FF']; //colours for log levels
    self.logToText = true; //if self is true, you can send data to server
    self.allText = ''; //global variable to save all logs 
    self.textFile = null;
    self.serverUrl = ""; //path to the server script
    self.batchSize = 0; //to turn off batching then just set self parameter to zero (0)
    self.batchSizeCheck = 0;
    self.turnDidalogOff = false;    //if set to true, didalog won't log anything
    self.useUTCDateTime = false;  // if set to true will use UTC time everywhere

    /**
    * @desc self method returns current date and time
    * @returns {string}
    */
    var getDateAndTime = function () {

        if (self.useUTCDateTime) {
            return getUTCDateAndTime();
        }

        var currentDate = new Date();
        var printDatetime = " " + currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + " @ "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();

        return printDatetime;
    };

    /**
   * @desc self method returns current UTC date and time
   * @returns {string}
   */
    var getUTCDateAndTime = function () {

        var currentDate = new Date();
        var printDatetime = " " + currentDate.getUTCDate() + "/"
            + (currentDate.getUTCMonth() + 1) + "/"
            + currentDate.getUTCFullYear() + " @ "
            + currentDate.getUTCHours() + ":"
            + currentDate.getUTCMinutes() + ":"
            + currentDate.getUTCSeconds();

        return printDatetime;
    };


    /**
    * @desc container for overriding console logging methods
    * @returns {string}
    */
    self.consoleOverride = new function () {
        var override = this;

        // Control flag variables
        override.intrusiveModeEnabled = false;
        override.skipRecusiveCall = false;

        // Backup old console logging functions
        override.old = new function () {
            this.log = console.log;
            this.warn = console.warn;
            this.error = console.error;
            this.debug = console.debug;
            this.info = console.info;
        };

        override.info = function () {
            var level = self.logLevels[0];

            if (!override.skipRecusiveCall) {
                self.log(level, arguments[0]);
            }

            override.skipRecusiveCall = false;
            override.old.info(arguments);
        };

        override.log = function () {
            var level = self.logLevels[0];

            if (!override.skipRecusiveCall) {
                self.log(level, arguments[0]);
            }

            override.skipRecusiveCall = false;
            override.old.log(arguments);
        };

        override.error = function () {
            var level = self.logLevels[1];

            if (!override.skipRecusiveCall) {
                self.log(level, arguments[0]);
            }

            override.skipRecusiveCall = false;
            override.old.error(arguments);
        };

        override.warn = function () {
            var level = self.logLevels[2];

            if (!override.skipRecusiveCall) {
                self.log(level, arguments[0]);
            }

            override.skipRecusiveCall = false;
            override.old.warn(arguments);
        };

        override.debug = function () {
            var level = self.logLevels[3];

            if (!override.skipRecusiveCall) {
                self.log(level, arguments[0]);
            }

            override.skipRecusiveCall = false;
            override.old.debug(arguments);
        };

        /**
       * @desc override default console logging methods like console.log, console.warn, console.info, console.debug
       * @returns {string}
       */
        override.init = function () {
            override.intrusiveModeEnabled = true;

            console.error = override.error;
            console.warn = override.warn;
            console.info = override.info;
            console.error = override.error;
            console.debug = override.debug;
            console.log = override.log;
        };
    };

    /**
     * @desc self method does the actual logging
     * @param level
     * @param msg
     */
    self.log = function (level, msg) {
        //if didalog is turned off than don't log anything
        if (self.turnDidalogOff)
            return;
        //if batching is on, than when we have to check the current batch size and sending size
        //otherwise user must call explicitly logToServer() method
        if (self.batchSize != 0 && self.batchSizeCheck == self.batchSize && self.logToText == true) {
            self.logToServer();
            self.batchSizeCheck = 0; //reset batchSizeCheck
        }

        level = self.checkLevel(level) ? level : self.defaultLogLevel;
        msg = msg || self.defaultMessage;

        if (self.logToText) {
            if (self.datetime) {
                self.allText += getDateAndTime() + " : " + level + " ::: " + msg + "\n";
            } else {
                self.allText += msg + "\n";
            }
            self.batchSizeCheck++;
        }
        if (self.didalogConsole) {
            self.didalogConsoleContainer();
            var didalogContainer = document.getElementById("didalogContainer");
            didalogContainer.appendChild(self.appendToDidalogContainer(msg, level));
        }

        return self.checkConsoleSupport() == true ? self.translateLogLevel(level, self.logMsg(level, msg))
            : alert("Console not supported");

    };

    /**
     * @desc self method check if the current browser has the console object
     * @returns {boolean}
     */
    self.checkConsoleSupport = function () {
        return (window.console) ? true : false;
    };

    /**
     * @desc self method is used internally for generating the log message string
     * @param level
     * @param msg
     * @returns {string}
     */
    self.setLogStringTemplate = function (level, msg) {
        var replacements = { "%LEVEL%": level, "%MSG%": msg },
            str = '::[%LEVEL%] %MSG%';

        str = str.replace(/%\w+%/g, function (all) {
            return replacements[all] || all;
        });
    };

    /**
     * @desc self method return msg prepared for logging
     * @param level
     * @param msg
     * @returns {string}
     */
    self.logMsg = function (level, msg) {


        if (self.datetime) {

            return (getDateAndTime() + " - " + level + ": " + msg);

        }
        else
            return (level + ": " + msg);
    };
    /**
     * @desc self method translate msg log level to console level
     * @param level
     * @param msg
     * @returns {*}
     */
    self.translateLogLevel = function (level, msg) {
        if (self.consoleOverride.intrusiveModeEnabled) {
            self.consoleOverride.skipRecusiveCall = true;
        }

        if (self.lvltoNumber(level) == 0)
            return console.info(msg);
        else if (self.lvltoNumber(level) == 1)
            return console.error(msg);
        else if (self.lvltoNumber(level) == 2)
            return console.warn(msg);
        else if (self.lvltoNumber(level) == 3)
            return console.debug(msg);
    };

    /**
     * @desc self method returns index of specified level
     * @param level
     * @returns {number|Number|*}
     */
    self.lvltoNumber = function (level) {

        return self.logLevels.indexOf(level);
    };

    /**
     * @desc self method checks does level exists
     * @param level
     * @returns {boolean}
     */
    self.checkLevel = function (level) {

        return (Array.apply(null, self.logLevels).indexOf(level) != -1);

    };

    /**
     * @desc self method will clear logger output
     */
    self.clear = function () {

        if (self.didalogConsole) {
            var didalogContainerLog = document.getElementById("didalog_onelog");
            didalogContainerLog.innerHTML = "";
            var msg = "Didalog Cleared.";
            var didalogContainer = document.getElementById("didalogContainer");
            didalogContainer.appendChild(self.appendToDidalogContainer(msg, "info"));
        }
        return self.checkConsoleSupport() == true ? console.clear()
            : alert("Console not supported");
    };

    /**
     * @desc self method will start new log group
     * @param groupName
     * @returns {*|void}
     */
    self.groupLogStart = function (groupName) {
        msg = groupName || self.defaultGroup;
        if (self.didalogConsole) {
            var didalogContainer = document.getElementById("didalogContainer");
            didalogContainer.appendChild(self.appendToDidalogContainer(":::::" + groupName + ":::::", "info"));
        }
        return self.checkConsoleSupport() == true ? console.group("Logging '%s'", msg)
            : alert("Console not supported");
    };

    /**
     * @desc self method will end log group
     * @returns {*|void}
     */
    self.groupLogEnd = function () {
        if (self.didalogConsole) {
            var didalogContainer = document.getElementById("didalogContainer");
            didalogContainer.appendChild(self.appendToDidalogContainer("::::: Group end :::::", "info"));
        }

        return self.checkConsoleSupport() == true ? console.groupEnd()
            : alert("Console not supported");
    };

    /**
     * @desc self method creates Didalog container
     */
    self.didalogConsoleContainer = function () {

        var container_div = "didalogContainer";
        var z_index = 9999;
        var log_div = "didalog_onelog";
        var group_name_div = "didalog_grouplog";
        var logHeight = 215;
        var didalog_button = "didalogButton";

        var containerDiv = document.getElementById(container_div);
        //create div only once
        if (!containerDiv) {

            containerDiv = document.createElement("div");
            containerDiv.id = container_div;
            containerDiv.setAttribute("style", "width:100%; " +
            "height: " + logHeight + "px; " +
            "transition:height 1s ease-out;" +
            "margin:0; " +
            "padding:0; " +
            "position:fixed; " +
            "left:0; " +
            "bottom: 0px;" +
            "display: block;" +
            "z-index:" + z_index + ";");

            // log message
            self.logDiv = document.createElement("div");
            self.logDiv.id = log_div;
            var cssHeight = "height:" + (logHeight - 11) + "px; ";
            self.logDiv.setAttribute("style", "font:12px monospace; " +
            cssHeight +
            "color:#fff; " +
            "overflow-x:hidden; " +
            "overflow-y:scroll; " +
            "position:relative; " +
            "bottom:0px; " +
            "margin:0px; " +
            "padding:5px; " +
            "background:#333; " +
            "background:rgba(0, 0, 0, 0.8); " +
            "border-top:1px solid #aaa; ");


            // the first message in log
            var msg = "Didalog Started";

            containerDiv.appendChild(self.appendToDidalogContainer(msg, "info"));

            var didalogButton = document.createElement("div");
            didalogButton.id = didalog_button;
            didalogButton.setAttribute("style",
            "position: absolute;" +
            "top: -30px;" +
            "padding: 10px;" +
            "right: 0px;" +
            "width: auto;" +
            "height: 11px;" +
            "background: #333;");

            didalogButton.onclick = self.slide;

            var spanDidalogButton = document.createElement("span");  // for coloring text
            spanDidalogButton.style.color = "#afa";
            spanDidalogButton.appendChild(document.createTextNode("Didalog"));
            didalogButton.appendChild(spanDidalogButton);

            containerDiv.appendChild(didalogButton);

            if (document.body != null) {
                document.body.appendChild(containerDiv);
            }




        }

    };
    /**
     * @desc self method slides Didalog external display (container)
     */
    self.slide = function () {
        var didalogContainer = document.getElementById("didalogContainer");
        var display = didalogContainer.style.height;
        if (display == "215px") {
            didalogContainer.style.height = "0px";
        } else if (display == "0px") {
            didalogContainer.style.height = "215px";
        }
    };
    /**
     * @desc self method adds message to Didalog container
     * @param msg
     * @param level
     * @returns {*}
     */
    self.appendToDidalogContainer = function (msg, level) {

        // style for log message
        var span = document.createElement("span");  // for coloring text
        span.style.color = self.didalogConsoleColors[self.lvltoNumber(level)];

        if (self.datetime) {
            span.appendChild(document.createTextNode(getDateAndTime() + " : " + level + " ::: " + msg));
        } else {
            span.appendChild(document.createTextNode(msg));
        }
        self.logDiv.appendChild(span);
        self.logDiv.appendChild(document.createElement("br"));   // blank line


        return self.logDiv;

    };

    /**
     * @desc self method creates .txt file from logs and downloads it
     */
    self.downloadLog = function () {

        if (self.turnDidalogOff)
            return;

        var textFileAsBlob = new Blob([self.allText], { type: 'text/plain' });

        var downloadLink = document.createElement("a");
        downloadLink.download = "didalog";
        downloadLink.innerHTML = "Download File";
        downloadLink.style.display = "none";
        if (window.webkitURL != null) {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
        //after download clear saved log 
        self.allText = "";

    };

    /**
     * @desc self method send logs to server in batches and using async. Set batch size and server url
     and async batch will be sent to server.
     */
    self.logToServer = function () {
        if (self.serverUrl != null) {
            var xhrForm = new XMLHttpRequest();
            xhrForm.open("POST", self.serverUrl, true); //true for async requests
            xhrForm.send(self.allText);
        } else {
            self.log("error", "URL to the server script must be set");
        }
        self.allText = ""; //reset global text variable to save resource
    };

};
