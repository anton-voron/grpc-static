const grpc = require('grpc');
const greets = require('./protos/greet_pb');
const services = require('./protos/greet_grpc_pb');
const fs = require('fs');

// Implement the greet gRPC methods

class Application {

    greet(socket, callback) {
        const response = new greets.GreetResponse();
        response.setResult(
            "Hello " + socket.request.getGreeting().getFirstName()
        );

        callback(null, response);
    }

    greetManyTimes(socket, callback) {
        const firstName = socket.request.getGreeting().getFirstName();
        const lastName = socket.request.getGreeting().getLastName();

        let count = 0, intervalID = setInterval(() => {
            const manyTimesResponse = new greets.GreetManyTimesResponse();
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

    longGreet(socket, callback) {
        socket.on('data', request => {
            const firstName = request.getGreeting().getFirstName();
            const lastName = request.getGreeting().getLastName();
            const fullName = firstName + ' ' + lastName;
            console.log('Hello, ', fullName);
        });

        socket.on('error', error => {
            console.error(error);
        });

        socket.on('end', () => {
            const response = new greets.LongGreetResponse();
            response.setResult('Long Greet Client Streaming ENDED!');
            console.log('LongGreet ended!');
            callback(null, response);
        })
    }

    async sleep(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), interval);
        })
    }

    async greetEveryone(socket, callback) {
        socket.on('data', request => {
            const firstName = request.getGreeting().getFirstName();
            const lastName = request.getGreeting().getLastName();

            const fullName = firstName + ' ' + lastName;
            console.log('Hello, ', fullName);

        })

        socket.on('error', error => {
            console.error(error);
        });

        socket.on('end', () => {
            console.log('LongGreet ended!');
        })

        for (let i = 0; i < 10; i++) {
            const response = new greets.GreetEveryoneResponse();
            response.setResult('Paulo Kekel');
            socket.write(response);
            await this.sleep(200);
        }
    }

    main() {
        const credentials = grpc.ServerCredentials.createSsl(
            fs.readFileSync('../certs/ca.crt'), [{
                cert_chain: fs.readFileSync('../certs/server.crt'),
                private_key: fs.readFileSync('../certs/server.key')
            }], true);

        const unsafeCreds = grpc.ServerCredentials.createInsecure();
        let Server = new grpc.Server();
        Server.addService(services.GreetServiceService, {
            greet: this.greet,
            greetManyTimes: this.greetManyTimes,
            longGreet: this.longGreet,
            greetEveryone: this.greetEveryone,
            sleep: this.sleep
        });
        Server.bind('127.0.0.1:50051', credentials);

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();