import * as AWS from 'aws-sdk';
import {PutRecordInput} from 'aws-sdk/clients/kinesis';


const kinesis: AWS.Kinesis = new AWS.Kinesis({apiVersion: '2013-12-02', region: 'us-west-2'});

const streamName: string = 'testStream';

const deviceId: string = 'a123';

let temp: number = 0; // Range 0-50 Celsius
let humid: number = 0; // Range 20-90% Relative Humidity


let i: number = 0;

if (process.argv[2] == undefined) {
    console.log('No argument detected!');
    process.exit(1);
}
let max: number = +process.argv[2];

function producerLoop() {
    setTimeout(() => {
        temp = Math.floor(Math.random() * (50 + 1));
        humid = Math.floor(Math.random() * (90 - 20 + 1)) + 20; // floor(random * (max - min + 1)) + min

        let paramData: string = JSON.stringify({
            deviceId: deviceId,
            deviceValues: {
                temperature: temp,
                humidity: humid
            },
            time: new Date()
        });

        console.log(paramData);

        // Create the Amazon Kinesis record
        let prParams: PutRecordInput = {
            Data: paramData,
            PartitionKey: 'partition-' + deviceId,
            StreamName: streamName
        };

        kinesis.putRecord(prParams, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log('SequenceNumber: ', data.SequenceNumber);           // successful response
            }
        });

        i++;
        if (i < max) {
            producerLoop(); // call self to do it again
        }

    }, 1000);
}

producerLoop();
