const grpc = require('grpc');
const calc = require('../server/protos/calculator_pb');
const calcServices = require('../server/protos/calculator_grpc_pb');

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

    main() {
        let client = new calcServices.CalculatorServiceClient(
            'localhost:50051',
            grpc.credentials.createInsecure()
        );

        // we do stuff!
        this.sendRequest(client);
        this.callPrimeNumberDecompositon(client);
        this.callComputeAverage(client);
    }
};

const client = new ClientApp();

client.main();