const grpc = require('grpc');
const calc = require('./protos/calculator_pb');
const calcService = require('./protos/calculator_grpc_pb');
const { write } = require('fs/promises');

class Application {

    sum(socket, callback) {
        const response = new calc.SumResponse();

        const x = socket.request.getFirstNumber();
        const y = socket.request.getSecoundNumber();

        response.setSumResult(x + y);

        callback(null, response);
    }

    primeNumberDecompositon(socket, callback) {
        let number = socket.request.getNumber();
        let devisor = 2;
        console.log('Recived number: ', number);
        while (number > 1) {
            if (number % devisor === 0) {
                let primeNumberDecompositonResponse = new calc.PrimeNumberDecompositonResponse();

                primeNumberDecompositonResponse.setPrimeFactor(devisor);
                number /= devisor;

                // set stream;
                socket.write(primeNumberDecompositonResponse);
            } else {
                devisor++;
                console.log('Devisor increase ', devisor);
            }
        }
        socket.end();
    }

    main() {
        let Server = new grpc.Server();
        Server.addService(calcService.CalculatorServiceService, {
            sum: this.sum,
            primeNumberDecompositon: this.primeNumberDecompositon
        });
        Server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();