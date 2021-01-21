const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const services = require('../server/protos/greet_grpc_pb');
const readline = require('readline');

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

    async readline(socket, greeting, callback) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });

        const commands = {
            help() {
                console.log('Comands: ' + Object.keys(commands).join(', '));
            },
            async ask() {
                const firstName = await this.question('Your first name is: ', rl);

                const lastName = await this.question('Your last name is: ', rl);
                callback({ firstName, lastName });
            },

            send() {
                const request = new greets.GreetEveryoneRequest();
                request.setGreeting(greeting);
                socket.write(request);
            },
            exit() {
                rl.close();
                socket.end();
            },
            buy() {
                rl.close();
                socket.end();
            },
            close() {
                rl.close();
                socket.end();
            }
        }

        rl.on('line', line => {
            line = line.trim();
            const command = commands[line]?.bind(this);
            if (command) {
                command();
            } else {
                console.log('Unknown command');
            }
        }).on('close', () => {
            console.log('Buy');
            process.exit(0);
        })
    }

    async question(question, rl) {
        return new Promise((resolve, reject) => rl.question(question, answ => {
            resolve(answ)
        }));
    }

    sleep(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), interval);
        })
    }

    async callGreetEveryone(client) {
        const request = new greets.GreetEveryoneRequest();
        const socket = client.greetEveryone(request, (error, response) => {
            if (!error) {
                console.log(`Server response: ${response.getResult()}`);
            } else {
                console.error(error);
            }
        });

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
        });

        // Read data from console
        // const greeting = new greets.Greeting();
        // await this.readline(socket, greeting, (answer) => {
        //     const { firstName, lastName } = answer;
        //     greeting.setFirstName(firstName);
        //     greeting.setLastName(lastName);
        // });

        for (let i = 0; i < 10; i++) {
            const greeting = new greets.Greeting();
            greeting.setFirstName('Paulo');
            greeting.setLastName('Moranie');

            const request = new greets.GreetEveryoneRequest();
            request.setGreeting(greeting);
            socket.write(request);
            await this.sleep(300);
        }
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
        // this.callLongGreet(client);

        this.callGreetEveryone(client);
    }
};

const client = new ClientApp();

client.main();