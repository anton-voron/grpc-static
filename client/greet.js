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

    main() {
        console.log("Hello form client");
        let client = new services.GreetServiceClient(
            'localhost:50051',
            grpc.credentials.createInsecure()
        );

        // we do stuff!
        this.sendRequest(client);
        this.sendRequestManyTimes(client);
    }
};

const client = new ClientApp();

client.main();