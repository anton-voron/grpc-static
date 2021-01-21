const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const services = require('../server/protos/greet_grpc_pb');

class ClientApp {

    sendRequest(client) {
        const greeting = new greets.Greeting();
        greeting.setFirstName('Jerry');
        greeting.setLastName('Tom');

        const request = new greets.GreetRequest();
        request.setGreeting(greeting);

        client.greet(request, (error, response) => {
            if (!error) {
                console.log("Greeting Response: ", response.getResult());
            } else {
                console.error(error);
            }
        })
    }

    sendRequestManyTimes(client) {
        const greeting = new greets.Greeting();
        greeting.setFirstName('Anton');
        greeting.setLastName('Voron');

        const request = new greets.GreetManyTimesRequest();
        request.setGreeting(greeting);

        const socket = client.greetManyTimes(request, () => { });

        socket.on('data', response => {
            console.log(`Client streaming response: ${response.getResult()}`);
        })

        socket.on('status', status => {
            console.log(status.details);
        })

        socket.on('end', () => {
            console.log('Streaming Ended!');
        })

        socket.on('error', error => {
            console.error(error.details);
        })
    }

    callLongGreet(client) {
        const request = new greets.LongGreetRequest();

        const socket = client.longGreet(request, (error, response) => {
            if (!error) {
                console.log(`Server response: ${response.getResult()}`);
            } else {
                console.error(error);
            }
        });

        let count = 0, intervalID = setInterval(() => {
            console.log('Sending message: ', count);
            const request = new greets.LongGreetRequest();
            const greeting = new greets.Greeting();

            greeting.setFirstName('Marcus');
            greeting.setLastName('Avreliy');
            request.setGreeting(greeting);

            socket.write(request);
            if (++count > 3) {
                clearInterval(intervalID);
                // we have sent all messages and stream can be closed
                socket.end();
            }
        }, 1000);
    }

    main() {
        console.log("Hello form client");
        let client = new services.GreetServiceClient(
            'localhost:50051',
            grpc.credentials.createInsecure()
        );

        // we do stuff!
        // this.sendRequest(client);
        // this.sendRequestManyTimes(client);
        this.callLongGreet(client);
    }
};

const client = new ClientApp();

client.main();