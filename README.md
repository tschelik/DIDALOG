# DIDALOG -  Debug Info Debug Alert LOG


Didalog is a Javascript logging wrapper and it lets you to do four things:

1. Log message 
2. Send logs on server
3. Download logs to .txt
4. See logs in external display and console 

**With DIDALOG you can easly logs messages on every device.**

## Quickstart

* **Initialize Didalog:** ``` var LOGGER = DIDALOG || {};```
* **Log levels:** ``` ['info', 'error', 'warning', 'debug']```
* **Log message:** ``` LOGGER.log('info', 'My log message');```
* **Start log group:** ``` LOGGER.groupLogStart("Group name");```
* **End log group:** ``` LOGGER.groupLogEnd();```
* **Download log (.txt file):** ``` LOGGER.downloadLog()```
* **Send logs to server explicitly:** ``` LOGGER.logToServer() ```

###Didalog properties:

```bash
defaultMessage: 'This is the default log message. Please enter your log message.',
datetime: true,
defaultGroup: 'DIDALOG',
didalogConsole: true, <if true external display will show up, to turn it off set to false>
logToText : <if true you can send data to server>
serverUrl: <path to the server script>
batchSize : 10 <to turn off batching then just set this parameter to zero (0)>
turnDidalogOff: false,   <if true didalog won't log anything>
```


###Available on Bower: bower install didalog 


