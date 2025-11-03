import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { asset } from "../../src/public/asset";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("asset", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(asset(client, parameters)).rejects.toThrow("Invalid address");
  });

  it("should call readContract if the address is valid", async function () {
    const assetAddress = zeroAddress;

    vi.mocked(readContract).mockResolvedValueOnce(assetAddress);

    const result = await asset(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      functionName: "asset",
    });
    expect(result).toBe(assetAddress);
  });

  it("should handle empty parameters gracefully", async function () {
    const parameters = {};

    await expect(asset(client, parameters)).rejects.toThrow("Invalid address");
  });

  it("should handle no parameters gracefully", async function () {
    await expect(asset(client, undefined)).rejects.toThrow("Invalid address");
  });
});
