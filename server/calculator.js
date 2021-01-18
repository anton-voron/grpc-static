const grpc = require('grpc');
const calc = require('./protos/calculator_pb');
const calcService = require('./protos/calculator_grpc_pb');

class Application {

    sum(socket, callback) {
        const response = new calc.SumResponse();

        const x = socket.request.getFirstNumber();
        const y = socket.request.getSecoundNumber();

        response.setSumResult(x + y);

        callback(null, response);
    }

    main() {
        let Server = new grpc.Server();
        Server.addService(calcService.CalculatorServiceService, { sum: this.sum });
        Server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());

        Server.start();

        console.log('Server started on port: 127.0.0.1:50051');
    }
}

const app = new Application();

app.main();