import { createPublicClient, http, zeroAddress, isAddress } from "viem";
import { hemi } from "viem/chains";
import { describe, expect, it } from "vitest";

import { asset } from "../../src/public/asset";
import { convertToAssets } from "../../src/public/convertToAssets";
import { convertToShares } from "../../src/public/convertToShares";
import { maxDeposit } from "../../src/public/maxDeposit";
import { maxMint } from "../../src/public/maxMint";
import { maxRedeem } from "../../src/public/maxRedeem";
import { maxWithdraw } from "../../src/public/maxWithdraw";
import { previewDeposit } from "../../src/public/previewDeposit";
import { previewMint } from "../../src/public/previewMint";
import { previewRedeem } from "../../src/public/previewRedeem";
import { previewWithdraw } from "../../src/public/previewWithdraw";
import { totalAssets } from "../../src/public/totalAssets";

// Known ERC-4626 vault on Hemi
const vault = "0xC95873B97E28FFfC9230A335cE193D8D7f09e523" as const;

const client = createPublicClient({
  chain: hemi,
  transport: http(),
});

describe("public actions e2e", function () {
  it("should return the asset address", async function () {
    const result = await asset(client, { address: vault });
    expect(isAddress(result)).toBe(true);
  });

  it("should return convertToAssets as a bigint", async function () {
    const result = await convertToAssets(client, {
      address: vault,
      shares: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return convertToShares as a bigint", async function () {
    const result = await convertToShares(client, {
      address: vault,
      assets: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return maxDeposit as a bigint", async function () {
    const result = await maxDeposit(client, {
      address: vault,
      receiver: zeroAddress,
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return maxMint as a bigint", async function () {
    const result = await maxMint(client, {
      address: vault,
      receiver: zeroAddress,
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return maxRedeem as a bigint", async function () {
    const result = await maxRedeem(client, {
      address: vault,
      owner: zeroAddress,
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return maxWithdraw as a bigint", async function () {
    const result = await maxWithdraw(client, {
      address: vault,
      owner: zeroAddress,
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return previewDeposit as a bigint", async function () {
    const result = await previewDeposit(client, {
      address: vault,
      assets: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return previewMint as a bigint", async function () {
    const result = await previewMint(client, {
      address: vault,
      shares: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return previewRedeem as a bigint", async function () {
    const result = await previewRedeem(client, {
      address: vault,
      shares: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return previewWithdraw as a bigint", async function () {
    const result = await previewWithdraw(client, {
      address: vault,
      assets: BigInt(1000),
    });
    expect(typeof result).toBe("bigint");
  });

  it("should return totalAssets as a bigint", async function () {
    const result = await totalAssets(client, { address: vault });
    expect(typeof result).toBe("bigint");
  });
});
