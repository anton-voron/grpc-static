const grpc = require('grpc');
const calc = require('./protos/calculator_pb');
const calcService = require('./protos/calculator_grpc_pb');
const fs = require('fs');

class Application {

    // Unary communication API
    sum(socket, callback) {
        const response = new calc.SumResponse();

        const x = socket.request.getFirstNumber();
        const y = socket.request.getSecoundNumber();

        response.setSumResult(x + y);

        callback(null, response);
    }


    // Server stream API
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


    // Client stream API
    computeAverage(socket, callback) {
        // running summ and count
        let sum = 0;
        let count = 0;

        socket.on('data', request => {
            //inc summ
            sum += request.getNumber();

            console.log(`Got:  number ${request.getNumber()}`);
            count += 1;
        });

        socket.on('error', error => {
            console.error(error);
        })

        socket.on('end', () => {
            const average = sum / count;
            const response = new calc.ComputeAverageResponse();
            response.setAverage(average);

            callback(null, response);
        })
    }

    // BiDI Stream API
    findMaximum(socket, callback) {
        let currentMaximum = 0;
        let currentNumber = 0;

        socket.on('data', request => {
            currentNumber = request.getNumber();
            if (currentNumber > currentMaximum) {
                currentMaximum = currentNumber;
                const response = new calc.FindMaximumResponse();
                response.setMaximum(currentMaximum);
                socket.write(response);
            }
            console.log(`Streamed number: ${currentNumber}`);
        });

        socket.on('error', error => {
            console.error(error);
        })

        socket.on('end', () => {
            const response = new calc.FindMaximumResponse();
            response.setMaximum(currentMaximum);
            socket.write(response);
            socket.end();
        })
    }

    squareRoot(socket, callback) {
        let number = socket.request.getNumber();
        if (number >= 0) {
            const numberRoot = Math.sqrt(number);
            const response = new calc.SquareRootResponse();
            response.setNumberRoot(numberRoot);
            callback(null, response);
        } else {
            // error handling
            return callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: 'The number been sent is not possitive. Number sent: ' + number
            })
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
        Server.addService(calcService.CalculatorServiceService, {
            sum: this.sum,
            primeNumberDecompositon: this.primeNumberDecompositon,
            computeAverage: this.computeAverage,
            findMaximum: this.findMaximum,
            squareRoot: this.squareRoot,
        });
        Server.bind('127.0.0.1:50051', credentials);

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();