import * as AWS from 'aws-sdk';
import {CreateStreamInput, DescribeStreamInput} from 'aws-sdk/clients/kinesis';

const kinesis: AWS.Kinesis = new AWS.Kinesis({apiVersion: '2013-12-02', region: 'us-west-2'});

const streamName: string = 'testStream';

// Create a new Kinesis Stream
try {
    let csParams: CreateStreamInput = {
        StreamName: streamName,
        ShardCount: 1
    };

    let createKinesisStreamPromise = kinesis.createStream(csParams).promise();

    createKinesisStreamPromise.then((data) => {
        console.log(data);

        // Check to make sure stream was created
        try {
            let wfParams: DescribeStreamInput = {
                StreamName: streamName
            };

            kinesis.waitFor('streamExists', wfParams, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log('Stream created: ', data);           // successful response
                }
            });
        } catch (error) {
            console.log('Failed to list stream: ', error)
        }
    }).catch(function (err) {
        console.log(err);
    });

} catch (error) {
    console.log('Failed to create stream: ', error);
}
