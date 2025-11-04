import { PublicClient, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { describe, it, expect, vi } from "vitest";

import { maxWithdraw } from "../../src/public/maxWithdraw";

vi.mock("viem/actions", () => ({
  readContract: vi.fn(),
}));

const validParameters = {
  address: zeroAddress,
  owner: zeroAddress,
};

// @ts-expect-error - We only create an empty client for testing purposes
const client: PublicClient = {};

describe("maxWithdraw", function () {
  it("should throw an error if the address is not valid", async function () {
    const parameters = {
      ...validParameters,
      address: "invalid_address",
    };

    await expect(maxWithdraw(client, parameters)).rejects.toThrow(
      "Invalid address",
    );
  });

  it("should throw an error if the owner address is not valid", async function () {
    const parameters = { ...validParameters, owner: "invalid_owner" };

    await expect(maxWithdraw(client, parameters)).rejects.toThrow(
      "Invalid owner address",
    );
  });

  it("should call readContract if all parameters are valid", async function () {
    const maxAssets = BigInt(8000);

    vi.mocked(readContract).mockResolvedValueOnce(maxAssets);

    const result = await maxWithdraw(client, validParameters);

    expect(readContract).toHaveBeenCalledWith(client, {
      abi: expect.anything(),
      address: validParameters.address,
      args: [validParameters.owner],
      functionName: "maxWithdraw",
    });
    expect(result).toBe(maxAssets);
  });

  it("should handle empty parameters gracefully", async function () {
    await expect(maxWithdraw(client, {})).rejects.toThrow("Invalid address");
  });

  it("should handle no parameters gracefully", async function () {
    await expect(maxWithdraw(client, undefined)).rejects.toThrow(
      "Invalid address",
    );
  });
});
