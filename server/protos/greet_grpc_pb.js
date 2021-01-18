// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var greet_pb = require('./greet_pb.js');

function serialize_greet_GreetManyTimesRequest(arg) {
  if (!(arg instanceof greet_pb.GreetManyTimesRequest)) {
    throw new Error('Expected argument of type greet.GreetManyTimesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetManyTimesRequest(buffer_arg) {
  return greet_pb.GreetManyTimesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetManyTimesResponce(arg) {
  if (!(arg instanceof greet_pb.GreetManyTimesResponce)) {
    throw new Error('Expected argument of type greet.GreetManyTimesResponce');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetManyTimesResponce(buffer_arg) {
  return greet_pb.GreetManyTimesResponce.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetRequest(arg) {
  if (!(arg instanceof greet_pb.GreetRequest)) {
    throw new Error('Expected argument of type greet.GreetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetRequest(buffer_arg) {
  return greet_pb.GreetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetResponce(arg) {
  if (!(arg instanceof greet_pb.GreetResponce)) {
    throw new Error('Expected argument of type greet.GreetResponce');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetResponce(buffer_arg) {
  return greet_pb.GreetResponce.deserializeBinary(new Uint8Array(buffer_arg));
}


var GreetServiceService = exports.GreetServiceService = {
  // unary API
  greet: {
    path: '/greet.GreetService/Greet',
    requestStream: false,
    responseStream: false,
    requestType: greet_pb.GreetRequest,
    responseType: greet_pb.GreetResponce,
    requestSerialize: serialize_greet_GreetRequest,
    requestDeserialize: deserialize_greet_GreetRequest,
    responseSerialize: serialize_greet_GreetResponce,
    responseDeserialize: deserialize_greet_GreetResponce,
  },
  // striaming API
  greetManyTimes: {
    path: '/greet.GreetService/GreetManyTimes',
    requestStream: false,
    responseStream: true,
    requestType: greet_pb.GreetManyTimesRequest,
    responseType: greet_pb.GreetManyTimesResponce,
    requestSerialize: serialize_greet_GreetManyTimesRequest,
    requestDeserialize: deserialize_greet_GreetManyTimesRequest,
    responseSerialize: serialize_greet_GreetManyTimesResponce,
    responseDeserialize: deserialize_greet_GreetManyTimesResponce,
  },
};

exports.GreetServiceClient = grpc.makeGenericClientConstructor(GreetServiceService);
