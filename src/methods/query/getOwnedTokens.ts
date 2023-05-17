import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { Token } from "../../types/query";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfo } from "./getAssetsInfo";
import { pipe } from "fp-ts/es6/function";
import * as A from "fp-ts/es6/Array";

export const getOwnedTokens = async (
  instancePromise: Promise<ApiPromise>,
  address: string
): Promise<{ [id: TokenId]: Token }> => {
  const api = await instancePromise;
  const [assetsInfo, accountBalances] = await Promise.all([
    getAssetsInfo(instancePromise),
    getAccountBalances(api, address)
  ]);

  return Object.fromEntries(
    pipe(
      Object.entries(assetsInfo),
      A.filter(([id]) => Object.keys(accountBalances).includes(id)),
      A.map(([id, assetInfo]) => [
        id,
        {
          ...assetInfo,
          balance: accountBalances[id]
        }
      ])
    )
  ) as { [id: TokenId]: Token };
};
