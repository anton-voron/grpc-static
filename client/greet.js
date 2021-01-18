const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const services = require('../server/protos/greet_grpc_pb');

class ClientApp {

    sendReqquest(client) {
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

    main() {
        console.log("Hello form client");
        let client = new services.GreetServiceClient(
            'localhost:50051',
            grpc.credentials.createInsecure()
        );

        // we do stuff!
        this.sendReqquest(client);
    }
};

const client = new ClientApp();

client.main();