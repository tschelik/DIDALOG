# DIDALOG
Javascript logging wrapper

The lib is under heavy development and hasn't been tested a single time.
Further development is in progress.

DIDALOG stands for Debug Info Debug Alert LOG

How to

Initialize Didalog:

var LOGGER = DIDALOG || {}; 

Log levels: 

['info', 'error', 'warning', 'debug']

example: 

LOGGER.log('info', 'My log message');

LOGGER.log('error', 'My log message');

LOGGER.log('warning', 'My log message');

LOGGER.log('debug', 'My log message');

To start log group: 

LOGGER.groupLogStart("Group name");

To end log group:

LOGGER.groupLogEnd();

Download log (.txt file): <to download log, logToText must be set to true> 

LOGGER.downloadLog() 

Send logs to server explicitly <set batchSize to 0, if batch size is > 0 than it will send logs automatically in batches>:

LOGGER.logToServer() 



Didalog properties:

defaultMessage: 'This is the default log message. Please enter your log message.',

datetime: true,

defaultGroup: 'DIDALOG',

didalogConsole: true, <if true external display will show up, to turn it off set to false>

logToText : <if true you can send data to server>

serverUrl: <path to the server script>

batchSize : 10 <to turn off batching then just set this parameter to zero (0)>

turnDidalogOff: false,   <if true didalog won't log anything>



