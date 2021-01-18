const grpc = require('grpc');
const greets = require('./protos/greet_pb');
const services = require('./protos/greet_grpc_pb');

// Implement the greet gRPC methods

class Application {

    greet(socket, callback) {
        const greeting = new greets.GreetResponce();
        greeting.setResult(
            "Hello " + socket.request.getGreeting().getFirstName()
        );

        callback(null, greeting);
    }

    main() {
        let Server = new grpc.Server();
        Server.addService(services.GreetServiceService, { greet: this.greet });
        Server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();