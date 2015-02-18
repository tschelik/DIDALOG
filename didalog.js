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
    defaultGroup: 'DIDALOG',
    didalogConsole: true,
    didalogConsoleColors : ['#008000', '#B22222', 'FFCC00', '#F8F8FF'],
    logToText : true,
    allText : '',
    textFile : null,
    turnDidalogOff: false,    //if set to true, didalog won't log anything
    /**
     * @desc This method does the actual logging
     * @param level
     * @param msg
     */
    log: function (level, msg) {
        //if didalog is turned off than don't log anything
        if(this.turnDidalogOff)
            return;

        level = this.checkLevel(level) ? level : this.defaultLogLevel;
        msg = msg || this.defaultMessage;
    
        if(this.logToText){
            if (this.datetime) {
                this.allText += this.getDateAndTime() + " : " + level + " ::: " + msg + "\n";
            } else {
               this.allText += msg + "\n";
            }
            
        }
        if(this.didalogConsole){
             this.didalogConsoleContainer();
             var didalogContainer = document.getElementById("didalogContainer");
             didalogContainer.appendChild(this.appendToDidalogContainer(msg, level));
            // didalogContainer.
        }

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


    getDateAndTime: function() {

        var currentDate = new Date();
        var printDatetime = " " + currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + " @ "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();

        return printDatetime;
    },


    /**
     This method writes msg on standard output (console)
     */
    logMsg: function (level, msg) {


        if (this.datetime) {

            return (this.getDateAndTime() + " - " + level + ": " + msg );

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

    if(this.didalogConsole){
        var didalogContainerLog = document.getElementById("didalog_onelog");
        didalogContainerLog.innerHTML = "";
        var msg = "Didalog Cleared.";
        var didalogContainer = document.getElementById("didalogContainer");
                didalogContainer.appendChild(this.appendToDidalogContainer(msg, "info"));
    }
        return this.checkConsoleSupport() == true ? console.clear()
            : alert("Console not supported");
    },

    /**
     This method will start console group
     */
    groupLogStart: function (groupName) {
        msg = groupName || this.defaultGroup;
    if(this.didalogConsole){
        var didalogContainer = document.getElementById("didalogContainer");
                didalogContainer.appendChild(this.appendToDidalogContainer(":::::" + groupName + ":::::", "info"));
    }
        return this.checkConsoleSupport() == true ? console.group("Logging '%s'", msg)
            : alert("Console not supported");
    },

    /**
     This method will end console group
     */
    groupLogEnd: function () {
    if(this.didalogConsole){
        var didalogContainer = document.getElementById("didalogContainer");
                didalogContainer.appendChild(this.appendToDidalogContainer("::::: Group end :::::", "info"));
    }

        return this.checkConsoleSupport() == true ? console.groupEnd()
            : alert("Console not supported");
    }, 

    didalogConsoleContainer: function () {

        var container_div = "didalogContainer";
        var z_index = 9999;
        var log_div = "didalog_onelog";
        var group_name_div = "didalog_grouplog";
        var logHeight = 215;
        var didalog_button = "didalogButton";

        var containerDiv = document.getElementById(container_div);
        //create div only once
        if(!containerDiv) {

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
            logDiv = document.createElement("div");
            logDiv.id = log_div;
            var cssHeight = "height:" + (logHeight - 11) + "px; ";  
            logDiv.setAttribute("style", "font:12px monospace; " +
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

            containerDiv.appendChild(this.appendToDidalogContainer(msg, "info"));

            var didalogButton = document.createElement("div");
            didalogButton.id = didalog_button;
            didalogButton.setAttribute("style", 
            "position: absolute;"+
            "top: -30px;" +
            "padding: 10px;" +
            "right: 0px;" + 
            "width: auto;" + 
            "height: 11px;" +
            "background: #333;" );

            didalogButton.onclick = this.slide;

            var spanDidalogButton = document.createElement("span");  // for coloring text
            spanDidalogButton.style.color = "#afa";
            spanDidalogButton.appendChild(document.createTextNode("Didalog"));
            didalogButton.appendChild(spanDidalogButton);

            containerDiv.appendChild(didalogButton);

            if(document.body != null){
                document.body.appendChild(containerDiv);
            }




        }

    },

    slide : function(){
        var didalogContainer = document.getElementById("didalogContainer");
        var display = didalogContainer.style.height;
        if (display == "215px") {
            didalogContainer.style.height = "0px";
        }else if(display == "0px"){
            didalogContainer.style.height = "215px";
        }
    },

    appendToDidalogContainer: function(msg, level){

        // style for log message
        var span = document.createElement("span");  // for coloring text
        span.style.color = this.didalogConsoleColors[this.lvltoNumber(level)];

        if (this.datetime) {
            span.appendChild(document.createTextNode(this.getDateAndTime() + " : " + level + " ::: " + msg));
        } else {
            span.appendChild(document.createTextNode(msg));
        }
        logDiv.appendChild(span);
        logDiv.appendChild(document.createElement("br"));   // blank line
        

        return logDiv;

    }, 

    /*
    This method download txt file of all saved logs 
    */
    downloadLog: function(){
        
        if(this.turnDidalogOff)
            return;

        var textFileAsBlob = new Blob([this.allText], {type: 'text/plain'});
        
        var downloadLink = document.createElement("a");
        downloadLink.download = "didalog";
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else
        {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
        //after download clear saved log 
        this.allText = "";
    
   }

};
