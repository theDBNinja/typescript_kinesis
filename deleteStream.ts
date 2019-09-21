import * as AWS from 'aws-sdk';
import {DeleteStreamInput, DescribeStreamInput} from 'aws-sdk/clients/kinesis';

const kinesis: AWS.Kinesis = new AWS.Kinesis({apiVersion: '2013-12-02', region: 'us-west-2'});

const streamName: string = 'testStream';

// Delete our Kinesis Stream
try {
    let dsParams: DeleteStreamInput = {
        StreamName: streamName,
    };

    let deleteKinesisStreamPromise = kinesis.deleteStream(dsParams).promise();

    deleteKinesisStreamPromise.then((data) => {
        console.log(data);

        // Check to make sure stream was deleted
        try {
            let wfParams: DescribeStreamInput = {
                StreamName: streamName
            };

            kinesis.waitFor('streamNotExists', wfParams, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log('Stream deleted: ', data);           // successful response
                }
            });
        } catch (error) {
            console.log('Failed to list stream: ', error)
        }
    })

} catch (error) {
    console.log('Failed to delete stream: ', error);
}