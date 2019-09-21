import * as AWS from 'aws-sdk';
import {DescribeStreamInput, GetRecordsInput, GetShardIteratorInput} from 'aws-sdk/clients/kinesis';

const kinesis: AWS.Kinesis = new AWS.Kinesis({apiVersion: '2013-12-02', region: 'us-west-2'});

const streamName: string = 'testStream';

// Describe Stream to get ShardId
let dsParams: DescribeStreamInput = {
    StreamName: streamName
};

const describeStreamPromise = kinesis.describeStream(dsParams).promise();

describeStreamPromise
    .then(function (describeStream) {
        // Describe Stream and pass ShardID to next function, only 1 shard in this example
        let shardId: string = describeStream.StreamDescription.Shards[0].ShardId;
        return shardId;
    })
    .then(async function (shardId) {
        // Get Shard Iterator
        let gsiParams: GetShardIteratorInput = {
            ShardId: shardId,
            ShardIteratorType: "TRIM_HORIZON",     // get oldest package
            StreamName: streamName,
        };

        let shardIteratorPromise = await kinesis.getShardIterator(gsiParams).promise();

        return shardIteratorPromise.ShardIterator!;
    })
    .then(function (myShardIterator) {
        // Get the records
        getTheRecords(myShardIterator);

    });

/**
 * Getting the records and looping every three seconds.
 *
 * @param shardIterator Either the initial Shard Iterator, or the Next Shard Iterator.
 */
function getTheRecords(shardIterator: string) {
    setTimeout(() => {
        console.log("ShardIterator: ", shardIterator);

        let grParams: GetRecordsInput = {
            ShardIterator: shardIterator,
            Limit: 20
        };

        kinesis.getRecords(grParams, function (err, result) {
            if (err) {
                console.log("Error in getRecords() from the Kinesis stream.");
                console.log(err);
            } else {
                console.log('');
                console.log("Record Count: ", result.Records.length);
                try {
                    if (result.Records.length > 0) {
                        // Loop through all the packages
                        for (let i = 0; i < result.Records.length; i++) {
                            if (result.Records[i] != undefined) {
                                console.log(result.Records[i].Data.toString());
                            }
                        }
                    }
                } catch (err) {
                    console.log("Error parsing the package.");
                    console.log(err);
                }

                // console.log('NextShardIterator: ', result.NextShardIterator!);

                if (result.NextShardIterator) {
                    getTheRecords(result.NextShardIterator!);
                }

            }
        });
    }, 3000);
}