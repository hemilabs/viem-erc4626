import { isAddress } from "viem";

export const assertAddress = function (value: string, name: string) {
  if (!isAddress(value)) {
    throw new Error(`Invalid ${name} address`);
  }
};

export const assertPositiveBigInt = function (value: bigint, name: string) {
  if (typeof value !== "bigint") {
    throw new Error(`Invalid ${name}`);
  }
  if (value <= BigInt(0)) {
    throw new Error(`Invalid ${name}, must be greater than 0`);
  }
};
