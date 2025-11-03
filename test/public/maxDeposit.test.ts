import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { maxDeposit } from "../../src/public/maxDeposit";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
  receiver: zeroAddress,
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("maxDeposit", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(maxDeposit(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if the receiver address is not valid", async function () {
    const parameters = {
      ...validParameters,
      receiver: "invalid_receiver",
    };

    await expect(maxDeposit(client, parameters)).rejects.toThrow(
      "Invalid receiver address",
    );
  });

  it("should call readContract if all parameters are valid", async function () {
    const maxAmount = BigInt(10000);

    vi.mocked(readContract).mockResolvedValueOnce(maxAmount);

    const result = await maxDeposit(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      args: [validParameters.receiver],
      functionName: "maxDeposit",
    });
    expect(result).toBe(maxAmount);
  });

  it("should handle empty parameters gracefully", async function () {
    await expect(maxDeposit(client, {})).rejects.toThrow("Invalid address");
  });

  it("should handle no parameters gracefully", async function () {
    await expect(maxDeposit(client, undefined)).rejects.toThrow(
      "Invalid address",
    );
  });
});
