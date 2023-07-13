import { ApiPromise, WsProvider } from "@polkadot/api";
import { RelayDeposit } from "../../types/xTokens";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const depositFromKusama = async (args: RelayDeposit) => {
  logger.info("Deposit From Kusama started ...");
  const {
    url,
    destination,
    beneficiary,
    assets,
    feeAssetItem,
    weightLimit,
    txOptions,
    account
  } = args;

  logger.info("depositFromKusama", {
    url,
    destination,
    beneficiary,
    assets,
    feeAssetItem,
    weightLimit
  });

  const api = await new ApiPromise({
    provider: new WsProvider(url),
    noInitWarn: true
  }).isReady;

  await api.tx.xcmPallet
    .limitedReserveTransferAssets(
      destination,
      beneficiary,
      assets,
      feeAssetItem,
      weightLimit
    )
    .signAndSend(account, {
      signer: txOptions?.signer,
      nonce: txOptions?.nonce
    });
};
