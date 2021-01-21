// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var calculator_pb = require('./calculator_pb.js');

function serialize_calculator_ComputeAverageRequest(arg) {
  if (!(arg instanceof calculator_pb.ComputeAverageRequest)) {
    throw new Error('Expected argument of type calculator.ComputeAverageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_ComputeAverageRequest(buffer_arg) {
  return calculator_pb.ComputeAverageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_ComputeAverageResponse(arg) {
  if (!(arg instanceof calculator_pb.ComputeAverageResponse)) {
    throw new Error('Expected argument of type calculator.ComputeAverageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_ComputeAverageResponse(buffer_arg) {
  return calculator_pb.ComputeAverageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_FindMaximumRequest(arg) {
  if (!(arg instanceof calculator_pb.FindMaximumRequest)) {
    throw new Error('Expected argument of type calculator.FindMaximumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_FindMaximumRequest(buffer_arg) {
  return calculator_pb.FindMaximumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_FindMaximumResponse(arg) {
  if (!(arg instanceof calculator_pb.FindMaximumResponse)) {
    throw new Error('Expected argument of type calculator.FindMaximumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_FindMaximumResponse(buffer_arg) {
  return calculator_pb.FindMaximumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_PrimeNumberDecompositonRequest(arg) {
  if (!(arg instanceof calculator_pb.PrimeNumberDecompositonRequest)) {
    throw new Error('Expected argument of type calculator.PrimeNumberDecompositonRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_PrimeNumberDecompositonRequest(buffer_arg) {
  return calculator_pb.PrimeNumberDecompositonRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_PrimeNumberDecompositonResponse(arg) {
  if (!(arg instanceof calculator_pb.PrimeNumberDecompositonResponse)) {
    throw new Error('Expected argument of type calculator.PrimeNumberDecompositonResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_PrimeNumberDecompositonResponse(buffer_arg) {
  return calculator_pb.PrimeNumberDecompositonResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_SumRequest(arg) {
  if (!(arg instanceof calculator_pb.SumRequest)) {
    throw new Error('Expected argument of type calculator.SumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_SumRequest(buffer_arg) {
  return calculator_pb.SumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_SumResponse(arg) {
  if (!(arg instanceof calculator_pb.SumResponse)) {
    throw new Error('Expected argument of type calculator.SumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_SumResponse(buffer_arg) {
  return calculator_pb.SumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CalculatorServiceService = exports.CalculatorServiceService = {
  // Unary API
  sum: {
    path: '/calculator.CalculatorService/Sum',
    requestStream: false,
    responseStream: false,
    requestType: calculator_pb.SumRequest,
    responseType: calculator_pb.SumResponse,
    requestSerialize: serialize_calculator_SumRequest,
    requestDeserialize: deserialize_calculator_SumRequest,
    responseSerialize: serialize_calculator_SumResponse,
    responseDeserialize: deserialize_calculator_SumResponse,
  },
  // Server Streaming API
  primeNumberDecompositon: {
    path: '/calculator.CalculatorService/PrimeNumberDecompositon',
    requestStream: false,
    responseStream: true,
    requestType: calculator_pb.PrimeNumberDecompositonRequest,
    responseType: calculator_pb.PrimeNumberDecompositonResponse,
    requestSerialize: serialize_calculator_PrimeNumberDecompositonRequest,
    requestDeserialize: deserialize_calculator_PrimeNumberDecompositonRequest,
    responseSerialize: serialize_calculator_PrimeNumberDecompositonResponse,
    responseDeserialize: deserialize_calculator_PrimeNumberDecompositonResponse,
  },
  // Client Stream API
  computeAverage: {
    path: '/calculator.CalculatorService/ComputeAverage',
    requestStream: true,
    responseStream: false,
    requestType: calculator_pb.ComputeAverageRequest,
    responseType: calculator_pb.ComputeAverageResponse,
    requestSerialize: serialize_calculator_ComputeAverageRequest,
    requestDeserialize: deserialize_calculator_ComputeAverageRequest,
    responseSerialize: serialize_calculator_ComputeAverageResponse,
    responseDeserialize: deserialize_calculator_ComputeAverageResponse,
  },
  // BiDi Stream API
  findMaximum: {
    path: '/calculator.CalculatorService/FindMaximum',
    requestStream: true,
    responseStream: true,
    requestType: calculator_pb.FindMaximumRequest,
    responseType: calculator_pb.FindMaximumResponse,
    requestSerialize: serialize_calculator_FindMaximumRequest,
    requestDeserialize: deserialize_calculator_FindMaximumRequest,
    responseSerialize: serialize_calculator_FindMaximumResponse,
    responseDeserialize: deserialize_calculator_FindMaximumResponse,
  },
};

exports.CalculatorServiceClient = grpc.makeGenericClientConstructor(CalculatorServiceService);
