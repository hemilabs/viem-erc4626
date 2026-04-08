import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  encodeAbiParameters,
  erc20Abi,
  http,
  isHash,
  keccak256,
  numberToHex,
  parseUnits,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import {
  readContract,
  setStorageAt,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import { hemi } from "viem/chains";
import { describe, expect, inject, it } from "vitest";

import { asset } from "../../src/public/asset";
import { deposit } from "../../src/wallet/deposit";
import { redeem } from "../../src/wallet/redeem";

// Known ERC-4626 vault on Hemi
const vault = "0xC95873B97E28FFfC9230A335cE193D8D7f09e523" as const;
// well known mnemonic from Anvil
const anvilMnemonic =
  "test test test test test test test test test test test junk";

const account = mnemonicToAccount(anvilMnemonic, { addressIndex: 0 });

// Set ERC-20 balance by writing to the balances storage slot directly.
// Tries common storage slots (0-5, 51) until balance changes.
async function dealErc20(options: {
  amount: bigint;
  publicClient: ReturnType<typeof createPublicClient>;
  testClient: ReturnType<typeof createTestClient>;
  to: `0x${string}`;
  token: `0x${string}`;
}) {
  const { amount, publicClient, testClient, to, token } = options;
  const value = numberToHex(amount, { size: 32 });
  for (const slot of [0n, 1n, 2n, 3n, 4n, 5n, 51n]) {
    const index = keccak256(
      encodeAbiParameters(
        [{ type: "address" }, { type: "uint256" }],
        [to, slot],
      ),
    );
    await setStorageAt(testClient, {
      address: token,
      index,
      value,
    });
    const balance = await readContract(publicClient, {
      abi: erc20Abi,
      address: token,
      args: [to],
      functionName: "balanceOf",
    });
    if (balance === amount) {
      return;
    }
  }
  throw new Error("Failed to deal ERC-20 tokens: could not find balances slot");
}

describe("wallet actions e2e", function () {
  it("should deposit and redeem", async function () {
    const anvilUrl = inject("anvilUrl");

    const publicClient = createPublicClient({
      chain: hemi,
      transport: http(anvilUrl),
    });

    const walletClient = createWalletClient({
      account,
      chain: hemi,
      transport: http(anvilUrl),
    });

    const testClient = createTestClient({
      chain: hemi,
      mode: "anvil",
      transport: http(anvilUrl),
    });

    // Get the underlying asset address
    const underlyingAsset = await asset(publicClient, { address: vault });

    // Get the asset decimals
    const assetDecimals = await readContract(publicClient, {
      abi: erc20Abi,
      address: underlyingAsset,
      functionName: "decimals",
    });

    const depositAmount = parseUnits("1", assetDecimals);

    // Deal underlying tokens to test account via storage manipulation
    await dealErc20({
      amount: depositAmount,
      publicClient,
      testClient,
      to: account.address,
      token: underlyingAsset,
    });

    // Approve the vault to spend underlying tokens
    const approveHash = await writeContract(walletClient, {
      abi: erc20Abi,
      address: underlyingAsset,
      args: [vault, depositAmount],
      functionName: "approve",
    });
    const approveReceipt = await waitForTransactionReceipt(publicClient, {
      hash: approveHash,
    });
    expect(approveReceipt.status).toBe("success");

    // Deposit into vault
    const depositHash = await deposit(walletClient, {
      address: vault,
      assets: depositAmount,
      receiver: account.address,
    });
    expect(isHash(depositHash)).toBe(true);

    const depositReceipt = await waitForTransactionReceipt(publicClient, {
      hash: depositHash,
    });
    expect(depositReceipt.status).toBe("success");

    // Check shares balance (vault is ERC-20, so balanceOf gives shares)
    const shares = await readContract(publicClient, {
      abi: erc20Abi,
      address: vault,
      args: [account.address],
      functionName: "balanceOf",
    });
    expect(shares).toBeGreaterThan(BigInt(0));

    // Redeem all shares
    const redeemHash = await redeem(walletClient, {
      address: vault,
      owner: account.address,
      receiver: account.address,
      shares,
    });
    expect(isHash(redeemHash)).toBe(true);

    const redeemReceipt = await waitForTransactionReceipt(publicClient, {
      hash: redeemHash,
    });
    expect(redeemReceipt.status).toBe("success");
  });
});
