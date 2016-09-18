"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assert;
function assert(boolean, message) {
  if (!boolean) {
    throw new Error(message);
  }
}