# viem-erc4626

Viem extensions for ERC-4626 tokenized vaults

[![NPM version](https://img.shields.io/npm/v/viem-erc4626)](https://www.npmjs.com/package/viem-erc4626) [![Package size](https://img.shields.io/bundlephobia/minzip/viem-erc4626)](https://bundlephobia.com/package/viem-erc4626) [![Follow Hemi on X](https://img.shields.io/twitter/url?url=https%3A%2F%2Fx.com%2Fhemi_xyz&style=flat&logo=x&label=%40hemi_xyz&labelColor=%23ff6c15&color=%230a0a0a)](https://x.com/intent/follow?screen_name=hemi_xyz)

## Installation

Install `viem`, `viem-erc20`, and `viem-erc4626` as dependencies:

```sh
npm install viem viem-erc20 viem-erc4626
```

## Methods

This package provides ESM-friendly helpers for interacting with ERC-4626 vault contracts using viem.

All the methods are named after the [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626):

### `allowance`

Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through transferFrom. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20-allowance-address-address-)

```ts
allowance(client, { address, owner, spender });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)
- **owner**: `Address` — Address that owns the tokens (required)
- **spender**: `Address` — Address that is allowed to spend the tokens (required)

**Example:**

```ts
import { allowance } from "viem-erc4626/actions";
const allowanceAmount = await allowance(client, {
  address: "0x12345678912345678912345678912345678912345",
  owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  spender: "0x1234567891234567891234567891234567891234",
});
```

### `approve`

Sets amount as the allowance of spender over the caller's tokens. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20-approve-address-uint256-)

```ts
approve(client, { address, spender, amount });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)
- **spender**: `Address` — Address to approve for spending tokens (required)
- **amount**: `bigint` — Amount of tokens to approve (required)

**Example:**

```ts
import { approve } from "viem-erc4626/actions";
const hash = await approve(client, {
  address: "0x12345678912345678912345678912345678912345",
  spender: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  amount: BigInt("1000000000000000000"), // 1 token
});
```

### `asset`

Returns the address of the underlying asset of the vault. [View docs](https://eips.ethereum.org/EIPS/eip-4626#asset)

```ts
asset(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)

**Example:**

```ts
import { asset } from "viem-erc4626/actions";
const assetAddress = await asset(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `balanceOf`

Returns the amount of tokens owned by account. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20-balanceOf-address-)

```ts
balanceOf(client, { address, account });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)
- **account**: `Address` — Address to check the balance of (required)

**Example:**

```ts
import { balance } from "viem-erc4626/actions";
const tokenBalance = await balanceOf(client, {
  address: "0x12345678912345678912345678912345678912345",
  account: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `convertToAssets`

Returns the amount of assets that would be exchanged by the vault for the amount of shares provided. [View docs](https://eips.ethereum.org/EIPS/eip-4626#converttoassets)

```ts
convertToAssets(client, { address, shares });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **shares**: `bigint` — Amount of shares to convert (required)

**Example:**

```ts
import { convertToAssets } from "viem-erc4626/actions";
const assetAmount = await convertToAssets(client, {
  address: "0x12345678912345678912345678912345678912345",
  shares: BigInt("1000000000000000000"), // 1 share
});
```

### `convertToShares`

Returns the amount of shares that would be exchanged by the vault for the amount of assets provided. [View docs](https://eips.ethereum.org/EIPS/eip-4626#converttoshares)

```ts
convertToShares(client, { address, assets });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **assets**: `bigint` — Amount of assets to convert (required)

**Example:**

```ts
import { convertToShares } from "viem-erc4626/actions";
const shareAmount = await convertToShares(client, {
  address: "0x12345678912345678912345678912345678912345",
  assets: BigInt("1000000000000000000"), // 1 asset
});
```

### `decimals`

Returns the number of decimals used to get its user representation. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20Metadata-decimals--)

```ts
decimals(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)

**Example:**

```ts
import { decimals } from "viem-erc4626/actions";
const tokenDecimals = await decimals(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `deposit`

Mints vault shares to receiver by depositing exactly assets of underlying tokens. [View docs](https://eips.ethereum.org/EIPS/eip-4626#deposit)

```ts
deposit(client, { address, assets, receiver });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **assets**: `bigint` — Amount of assets to deposit (required)
- **receiver**: `Address` — Address to receive the vault shares (required)

**Example:**

```ts
import { deposit } from "viem-erc4626/actions";
const hash = await deposit(client, {
  address: "0x12345678912345678912345678912345678912345",
  assets: BigInt("1000000000000000000"), // 1 asset
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `maxDeposit`

Returns the maximum amount of the underlying asset that can be deposited into the vault for the receiver. [View docs](https://eips.ethereum.org/EIPS/eip-4626#maxdeposit)

```ts
maxDeposit(client, { address, receiver });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **receiver**: `Address` — Address that would receive the vault shares (required)

**Example:**

```ts
import { maxDeposit } from "viem-erc4626/actions";
const maxDepositAmount = await maxDeposit(client, {
  address: "0x12345678912345678912345678912345678912345",
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `maxMint`

Returns the maximum amount of the vault shares that can be minted for the receiver. [View docs](https://eips.ethereum.org/EIPS/eip-4626#maxmint)

```ts
maxMint(client, { address, receiver });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **receiver**: `Address` — Address that would receive the vault shares (required)

**Example:**

```ts
import { maxMint } from "viem-erc4626/actions";
const maxMintAmount = await maxMint(client, {
  address: "0x12345678912345678912345678912345678912345",
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `maxRedeem`

Returns the maximum amount of vault shares that can be redeemed from the owner balance. [View docs](https://eips.ethereum.org/EIPS/eip-4626#maxredeem)

```ts
maxRedeem(client, { address, owner });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **owner**: `Address` — Address that owns the vault shares (required)

**Example:**

```ts
import { maxRedeem } from "viem-erc4626/actions";
const maxRedeemAmount = await maxRedeem(client, {
  address: "0x12345678912345678912345678912345678912345",
  owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `maxWithdraw`

Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance. [View docs](https://eips.ethereum.org/EIPS/eip-4626#maxwithdraw)

```ts
maxWithdraw(client, { address, owner });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **owner**: `Address` — Address that owns the vault shares (required)

**Example:**

```ts
import { maxWithdraw } from "viem-erc4626/actions";
const maxWithdrawAmount = await maxWithdraw(client, {
  address: "0x12345678912345678912345678912345678912345",
  owner: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `mint`

Mints exactly shares vault shares to receiver by depositing assets of underlying tokens. [View docs](https://eips.ethereum.org/EIPS/eip-4626#mint)

```ts
mint(client, { address, shares, receiver });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **shares**: `bigint` — Amount of shares to mint (required)
- **receiver**: `Address` — Address to receive the vault shares (required)

**Example:**

```ts
import { mint } from "viem-erc4626/actions";
const hash = await mint(client, {
  address: "0x12345678912345678912345678912345678912345",
  shares: BigInt("1000000000000000000"), // 1 share
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
});
```

### `name`

Returns the name of the token. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20Metadata-name--)

```ts
name(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)

**Example:**

```ts
import { name } from "viem-erc4626/actions";
const tokenName = await name(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `previewDeposit`

Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block. [View docs](https://eips.ethereum.org/EIPS/eip-4626#previewdeposit)

```ts
previewDeposit(client, { address, assets });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **assets**: `bigint` — Amount of assets to preview deposit (required)

**Example:**

```ts
import { previewDeposit } from "viem-erc4626/actions";
const expectedShares = await previewDeposit(client, {
  address: "0x12345678912345678912345678912345678912345",
  assets: BigInt("1000000000000000000"), // 1 asset
});
```

### `previewMint`

Allows an on-chain or off-chain user to simulate the effects of their mint at the current block. [View docs](https://eips.ethereum.org/EIPS/eip-4626#previewmint)

```ts
previewMint(client, { address, shares });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **shares**: `bigint` — Amount of shares to preview mint (required)

**Example:**

```ts
import { previewMint } from "viem-erc4626/actions";
const requiredAssets = await previewMint(client, {
  address: "0x12345678912345678912345678912345678912345",
  shares: BigInt("1000000000000000000"), // 1 share
});
```

### `previewRedeem`

Allows an on-chain or off-chain user to simulate the effects of their redeem at the current block. [View docs](https://eips.ethereum.org/EIPS/eip-4626#previewredeem)

```ts
previewRedeem(client, { address, shares });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **shares**: `bigint` — Amount of shares to preview redeem (required)

**Example:**

```ts
import { previewRedeem } from "viem-erc4626/actions";
const expectedAssets = await previewRedeem(client, {
  address: "0x12345678912345678912345678912345678912345",
  shares: BigInt("1000000000000000000"), // 1 share
});
```

### `previewWithdraw`

Allows an on-chain or off-chain user to simulate the effects of their withdraw at the current block. [View docs](https://eips.ethereum.org/EIPS/eip-4626#previewwithdraw)

```ts
previewWithdraw(client, { address, assets });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **assets**: `bigint` — Amount of assets to preview withdraw (required)

**Example:**

```ts
import { previewWithdraw } from "viem-erc4626/actions";
const requiredShares = await previewWithdraw(client, {
  address: "0x12345678912345678912345678912345678912345",
  assets: BigInt("1000000000000000000"), // 1 asset
});
```

### `redeem`

Burns exactly shares from owner and sends assets of underlying tokens to receiver. [View docs](https://eips.ethereum.org/EIPS/eip-4626#redeem)

```ts
redeem(client, { address, shares, receiver, owner });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **shares**: `bigint` — Amount of shares to redeem (required)
- **receiver**: `Address` — Address to receive the underlying assets (required)
- **owner**: `Address` — Address that owns the vault shares (required)

**Example:**

```ts
import { redeem } from "viem-erc4626/actions";
const hash = await redeem(client, {
  address: "0x12345678912345678912345678912345678912345",
  shares: BigInt("1000000000000000000"), // 1 share
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  owner: "0x1234567891234567891234567891234567891234",
});
```

### `symbol`

Returns the symbol of the token, usually a shorter version of the name. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20Metadata-symbol--)

```ts
symbol(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)

**Example:**

```ts
import { symbol } from "viem-erc4626/actions";
const tokenSymbol = await symbol(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `totalAssets`

Returns the total amount of the underlying asset that is managed by the vault. [View docs](https://eips.ethereum.org/EIPS/eip-4626#totalassets)

```ts
totalAssets(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)

**Example:**

```ts
import { totalAssets } from "viem-erc4626/actions";
const totalAssetAmount = await totalAssets(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `totalSupply`

Returns the amount of tokens in existence. [View docs](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20#IERC20-totalSupply--)

```ts
totalSupply(client, { address });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-20 token contract address (required)

**Example:**

```ts
import { totalSupply } from "viem-erc4626/actions";
const tokenTotalSupply = await totalSupply(client, {
  address: "0x12345678912345678912345678912345678912345",
});
```

### `withdraw`

Burns shares from owner and sends exactly assets of underlying tokens to receiver. [View docs](https://eips.ethereum.org/EIPS/eip-4626#withdraw)

```ts
withdraw(client, { address, assets, receiver, owner });
```

- **client**: `Client` — from viem — (required)
- **address**: `Address` — ERC-4626 vault contract address (required)
- **assets**: `bigint` — Amount of assets to withdraw (required)
- **receiver**: `Address` — Address to receive the underlying assets (required)
- **owner**: `Address` — Address that owns the vault shares (required)

**Example:**

```ts
import { withdraw } from "viem-erc4626/actions";
const hash = await withdraw(client, {
  address: "0x12345678912345678912345678912345678912345",
  assets: BigInt("1000000000000000000"), // 1 asset
  receiver: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
  owner: "0x1234567891234567891234567891234567891234",
});
```
