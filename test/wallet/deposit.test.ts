import { decodeFunctionData, erc4626Abi, isHex, zeroAddress } from "viem";
import { WalletClient } from "viem";
import { writeContract } from "viem/actions";
import { hemiSepolia } from "viem/chains";
import { describe, it, expect, vi } from "vitest";

import { deposit, encodeDepositData } from "../../src/wallet/deposit";

vi.mock("viem/actions", () => ({
  writeContract: vi.fn(),
}));

// @ts-expect-error - We only create an empty client for testing purposes
const client: WalletClient = { account: zeroAddress, chain: hemiSepolia };

const validParameters = {
  address: zeroAddress,
  assets: BigInt(1000),
  receiver: zeroAddress,
};

describe("deposit", function () {
  it("should throw an error if account is not defined", async function () {
    // @ts-expect-error - We only create an empty client for testing purposes
    const clientWithoutAccount: WalletClient = {};

    await expect(
      deposit(clientWithoutAccount, validParameters),
    ).rejects.toThrow("Client is missing an account");
  });

  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(deposit(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if the receiver address is not valid", async function () {
    const parameters = {
      ...validParameters,
      receiver: "invalid_receiver",
    };

    await expect(deposit(client, parameters)).rejects.toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if assets is not a bigint", async function () {
    const parameters = { ...validParameters, assets: 1000 };

    await expect(deposit(client, parameters)).rejects.toThrow("Invalid assets");
  });

  it("should throw an error if assets is less than or equal to 0", async function () {
    const parameters = { ...validParameters, assets: BigInt(0) };

    await expect(deposit(client, parameters)).rejects.toThrow(
      "Invalid assets, must be greater than 0",
    );
  });

  it("should call writeContract if all parameters are valid", async function () {
    const parameters = { ...validParameters };

    vi.mocked(writeContract).mockResolvedValueOnce({ success: true });

    const result = await deposit(client, parameters);

    expect(writeContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      account: client.account,
      address: validParameters.address,
      args: [validParameters.assets, validParameters.receiver],
      chain: client.chain,
      functionName: "deposit",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("encodeDepositData", function () {
  const validEncodeParameters = {
    assets: BigInt(1000),
    receiver: zeroAddress,
  };

  it("should throw an error if assets is not a bigint", function () {
    const parameters = { ...validEncodeParameters, assets: 1000 };

    // @ts-expect-error - Testing invalid assets type
    expect(() => encodeDepositData(parameters)).toThrow("Invalid assets");
  });

  it("should throw an error if the receiver address is not valid", function () {
    const parameters = {
      ...validEncodeParameters,
      receiver: "invalid_receiver",
    };

    // @ts-expect-error - Testing invalid receiver address
    expect(() => encodeDepositData(parameters)).toThrow(
      "Invalid receiver address",
    );
  });

  it("should throw an error if assets is less than or equal to 0", function () {
    const parameters = { ...validEncodeParameters, assets: BigInt(0) };

    expect(() => encodeDepositData(parameters)).toThrow(
      "Invalid assets, must be greater than 0",
    );
  });

  it("should throw an error if the parameters are not defined", function () {
    // @ts-expect-error - Testing undefined parameters
    expect(() => encodeDepositData(undefined)).toThrow("Invalid assets");
  });

  it("should return the encoded call data if all parameters are valid", function () {
    const data = encodeDepositData(validEncodeParameters);

    expect(isHex(data)).toBe(true);
    expect(decodeFunctionData({ abi: erc4626Abi, data })).toEqual({
      args: [validEncodeParameters.assets, validEncodeParameters.receiver],
      functionName: "deposit",
    });
  });
});
