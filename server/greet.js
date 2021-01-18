const grpc = require('grpc');
const greets = require('./protos/greet_pb');
const services = require('./protos/greet_grpc_pb');

// Implement the greet gRPC methods

class Application {

    greet(socket, callback) {
        const response = new greets.GreetResponce();
        response.setResult(
            "Hello " + socket.request.getGreeting().getFirstName()
        );

        callback(null, response);
    }

    greetManyTimes(socket, callback) {
        const firstName = socket.request.getGreeting().getFirstName();
        const lastName = socket.request.getGreeting().getLastName();

        let count = 0, intervalID = setInterval(() => {
            const manyTimesResponse = new greets.GreetManyTimesResponce();
            manyTimesResponse.setResult(`Hello many times ${firstName} ${lastName}`);

            //setup streaming
            socket.write(manyTimesResponse);
            if (++count > 9) {
                clearInterval(intervalID);

                // we have sent all messages;
                socket.end();
            }
        }, 1000);
    }

    main() {
        let Server = new grpc.Server();
        Server.addService(services.GreetServiceService, {
            greet: this.greet,
            greetManyTimes: this.greetManyTimes
        });
        Server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();