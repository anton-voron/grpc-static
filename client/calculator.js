const grpc = require('grpc');
const calc = require('../server/protos/calculator_pb');
const calcServices = require('../server/protos/calculator_grpc_pb');
const fs = require('fs');

class ClientApp {

    sendRequest(client) {
        const request = new calc.SumRequest();

        request.setFirstNumber(5);
        request.setSecoundNumber(3);

        client.sum(request, (error, response) => {
            if (!error) {
                console.log("Calculator Response: ", response.getSumResult());
            } else {
                console.error(error);
            }
        })
    }

    callPrimeNumberDecompositon(client) {
        const request = new calc.PrimeNumberDecompositonRequest();

        let number = 20;
        request.setNumber(number);

        const socket = client.primeNumberDecompositon(request, () => { });

        socket.on('data', response => {
            console.log(`PrimeFactor Found: ${response.getPrimeFactor()}`);
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

    callComputeAverage(client) {
        const request = new calc.ComputeAverageRequest();

        const socket = client.computeAverage(request, (error, response) => {
            if (!error) {
                console.log("ComputeAverage Response: ", response.getAverage());
            } else {
                console.error(error);
            }
        })

        for (let i = 1; i < 5; i++) {
            const req = new calc.ComputeAverageRequest();
            req.setNumber(i);
            socket.write(req);
        }

        socket.end();
    }

    async sleep(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), interval);
        })
    }

    async callFindMaximum(client) {
        const request = new calc.FindMaximumRequest();

        const socket = client.findMaximum(request, (error, response) => { });

        socket.on('data', response => {
            console.log(`Max form server =>  ${response.getMaximum()}`);
        });

        socket.on('end', () => {
            console.log('Server completed sending messages!');
            socket.end();
        });

        socket.on('error', error => {
            console.error(error);
        });

        for (let i = 0; i < 10; i++) {
            const number = Math.round(Math.random() * 100);
            const request = new calc.FindMaximumRequest();
            request.setNumber(number);
            socket.write(request);
            await this.sleep(300);
        }

        socket.end();
    }


    // error handling
    callSquareRoot(client) {
        let deadline = this.getRPCDeadline(1);
        console.log('deadline', deadline);
        const number = -321;
        const request = new calc.SquareRootRequest();
        request.setNumber(number);
        // set deadline to limit execution time
        client.squareRoot(request, { deadline: deadline }, (error, response) => {
            if (!error) {
                console.log("Calculator Square Root is: ", response.getSquareRoot());
            } else {
                console.error(error.message);
            }
        })
    }

    getRPCDeadline(rpcType) {
        let timeAllowed = 5000;
        switch (rpcType) {
            case 1:
                timeAllowed = 1000;
                break;
            case 2:
                timeAllowed = 7000;
                break;
            default:
                console.log('Invalid RPC Type');
                break;
        }

        return new Date(Date.now() + timeAllowed);
    }

    main() {
        const credentials = grpc.credentials.createSsl(
            fs.readFileSync('../certs/ca.crt'),
            fs.readFileSync('../certs/client.key'),
            fs.readFileSync('../certs/client.crt')
        );

        const unsafeCreds = grpc.credentials.createInsecure();

        let client = new calcServices.CalculatorServiceClient(
            'localhost:50051',
            credentials
        );

        // we do stuff!
        // this.sendRequest(client);
        // this.callPrimeNumberDecompositon(client);
        // this.callComputeAverage(client);
        // this.callFindMaximum(client);
        // this.callSquareRoot(client);
    }
};

const client = new ClientApp();

client.main();