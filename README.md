# TypeScript Kinesis Test

These scripts can create a stream, delete a stream, put records into a stream, and read the records out of the stream.

An aws config file will need to be available in order to run the scripts.

In a terminal, under the directory for this repo, run the following commands to set it up.

```shell script
npm install
npm run build-ts
```

To run the scripts
```shell script
node ./dist/createStream.js
node ./dist/producer.js {num of records to insert}
node ./dist/getRecords.js # Will loop forever, and show any new records added while it runs
node ./dist/deleteStream.js
```