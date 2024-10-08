// import { getWebApp } from "@/utils/getWebApp";
import {
  formatCurrency,
  formatCurrencyWithoutDollarSign,
  formatter,
  getAddressFromTelegramId,
  getPrivateKeyFromTelegramId,
  getTokenDetails,
  getUserTokenBalance,
  verifyTelegramWebAppData,
} from "./utils";
import { UserSolSmartWalletClass } from "./solana-provider";
import { PercentRange, SellTokenInSolParams, SellTokenParams } from "./types";
import { SLippageExceedingError } from "./solanaError";
import {
  calculateProfitLoss,
  decrementUserSimulationBalance,
  getBuyTransaction,
  getUserFromTelegramId,
  getUserSImulationBalance,
  incrementUserSimulationBalance,
  updatePositionOnBuySimulation,
  updatePositionOnSell,
} from "./prisma";
import { Wallet } from "@prisma/client";
import prisma from "@/prisma";
interface WebApp {
  /**
   * this is the initData form the telegram WebApp object , i am using it to verify the validity of the passed data, make sure you pass it.
   */
  WebAppInitData: string;
}

interface GetWalletAddressInput extends WebApp {
  telegramId: string;
}
interface WithdrawalInput extends WebApp {
  destinationAddress: string;
  amount: number;
  telegramId: string;
}

interface GetUserPositionsInput extends WebApp {
  telegramId: string;
}

export interface BuyTokenInput extends WebApp {
  tokenAddress: string;
  amountInSol: number;
  telegramId: string;
}

export interface SellTokenInput extends WebApp {
  telegramId: string;
  tokenAddress: string;
  amountInSol: number;
  amountPercent: number;
  type: "PERCENT" | "AMOUNT";
}
export const ExampleFunction = async (data: WebApp) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
};
//NOW TO START THE FUNCTIONS

//SHOW WALLET ADDREEE

/**
 * call this function to get the wallet address of the user
 */
export const getWalletAddress = (data: GetWalletAddressInput): string => {
  return getAddressFromTelegramId(Number(data.telegramId));
};

export const withdrawSOl = async (data: WithdrawalInput): Promise<string> => {
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);
  const res = await userWalletClass.withdrawSol(
    data.amount,
    data.destinationAddress
  );
  return res;
};

export const getUserPositions = async (data: GetUserPositionsInput) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
};

export const buyToken = async (data: BuyTokenInput) => {
  const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  if (!validateData) {
    throw new Error("Invalid WebAppInitData");
  }
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);
  const res = await userWalletClass.buy({
    token: data.tokenAddress,
    amountInSol: data.amountInSol,
  });
  return res;
};

export const sellToken = async (data: SellTokenInput) => {
  // const validateData = await verifyTelegramWebAppData(data.WebAppInitData);

  // if (!validateData) {
  //   throw new Error("Invalid WebAppInitData");
  // }
  const key = getPrivateKeyFromTelegramId(data.telegramId);
  const userWalletClass = new UserSolSmartWalletClass(key);

  if (data.type === "AMOUNT") {
    const params: SellTokenInSolParams = {
      token: data.tokenAddress,
      amountToSellInSol: data.amountInSol.toString(),
    };
    try {
      return await userWalletClass.sell(params);
    } catch (error) {
      console.log("error: ", error);
      if (error instanceof SLippageExceedingError) {
        // handle slippage error
        // return a message to the user to increase their sell price or reduce their buy price
        return { status: false, result: null };
      }
    }
  }

  if (data.type === "PERCENT") {
    const params: SellTokenParams = {
      token: data.tokenAddress,
      percentToSell: data.amountPercent as PercentRange,
    };
    try {
      return await userWalletClass.sell(params);
    } catch (error) {
      console.log("error: ", error);
      if (error instanceof SLippageExceedingError) {
        // handle slippage error
        // return a message to the user to increase their sell price or reduce their buy price
        return { status: false, result: null };
      }
    }
  }
};

export const getWalletGetUserWalletBalance = async (
  data: GetWalletAddressInput
) => {
  const userAddress = getAddressFromTelegramId(Number(data.telegramId));

  const balance = await UserSolSmartWalletClass.getSolBalance(userAddress);
  console.log("balance: ", balance);

  return balance;
};

export const simulationBuy = async (params: BuyTokenInput) => {
  const userBalance = await getUserSImulationBalance(params.telegramId);
  console.log("userBalance: ", userBalance);

  if (Number(userBalance) < params.amountInSol) {
    return { status: false, message: "Not Enough SImulation Balance" };
  }

  try {
    await completeBuyActionSimulation(
      params.telegramId,
      params.tokenAddress,
      params.amountInSol
    );
  } catch (error) {
    console.log("unable to complete Buy Simulation:", error);
  }
};

export const completeBuyActionSimulation = async (
  telegramId: string,
  tokenAddress: string,
  amount: number
) => {
  try {
    //updating user simulationBalance
    console.log("Incrementing user balance");
    await decrementUserSimulationBalance(telegramId, amount);
    console.log("finish incrementing user balance");
    const user = await getUserFromTelegramId(telegramId);
    console.log("user: ", user);
    const tokenDetails = await getTokenDetails(tokenAddress);
    const amountInToken = amount / Number(tokenDetails.priceNative);
    console.log("amountInToken: ", amountInToken);
    let wallet: Wallet;
    if (user.wallet.length < 0) {
      const address = getAddressFromTelegramId(Number(telegramId));

      wallet = await prisma.wallet.upsert({
        where: { address: address },
        update: {},
        create: { userId: user.id, address: address, isPrimary: true },
      });
    }
    wallet = user.wallet.filter((wallet: Wallet) => wallet.isPrimary)[0];
    if (!wallet) {
      const address = getAddressFromTelegramId(Number(telegramId));

      wallet = await prisma.wallet.upsert({
        where: { address: address },
        update: {},
        create: { userId: user.id, address: address, isPrimary: true },
      });
    }
    console.log("wallet: ", wallet);

    await prisma.transaction.create({
      data: {
        amountBought: amountInToken.toString(),
        tokenAddress: tokenAddress,
        status: "bought",
        buyHash: "simulation",
        tokenTicker: tokenDetails.name,
        walletId: wallet.id,
        userId: user.id,
        buyPrice: tokenDetails.priceUsd.toString(),
      },
    });
    console.log("updating user position");
    await updatePositionOnBuySimulation(
      user.id,
      wallet.id,
      tokenAddress,
      tokenDetails.name,
      amountInToken.toString(),
      tokenDetails.priceUsd.toString(),
      true
    );
    console.log("finished updating user positions");
  } catch (error) {
    console.log("error: ", error);
  }
};

export const simulationSellToken = async (params: SellTokenInput) => {
  await validateAmountGetTokenAndSellSimulation(
    params.telegramId,
    params.tokenAddress,
    params.type,
    params.amountInSol
  );
};

const validateAmountGetTokenAndSellSimulation = async (
  telegramId: string,
  tokenAddress: string,
  type: "PERCENT" | "AMOUNT",
  amount?: number,
  percentToSell?: PercentRange
) => {
  if (!(type === "PERCENT")) {
    console.error("Invalid type provided");
    return;
  }
  //validate that the field percentToSell is present
  if (!percentToSell) {
    return { status: false, message: "Please provide a percentage to sell" };
  }
  //SIMULATION THE SELL

  const user = await getUserFromTelegramId(telegramId);
  const position = user.positions.find(
    (position) =>
      position.isSimulation == true && position.tokenAddress === tokenAddress
  );
  const amountHeld = Number(position.amountHeld);
  const percentSold = amountHeld * (percentToSell / 100);
  const amountToSell = percentSold;
  const tokenDetails = await getTokenDetails(tokenAddress);
  const tokenSolPrice = Number(tokenDetails.priceNative);
  console.log("tokenSolPrice: ", tokenSolPrice);
  const amountInSol = tokenSolPrice * amountToSell;
  console.log("amountInSol: ", amountInSol);

  await incrementUserSimulationBalance(telegramId, amountInSol);

  console.log("amountInToken: ", amountToSell);
  amount = amountToSell;

  const wallet = user.wallet.filter((wallet: Wallet) => wallet.isPrimary)[0];
  //if wallet does not exist, create it
  if (!user.wallet) {
    const address = getAddressFromTelegramId(Number(telegramId));

    await prisma.wallet.upsert({
      where: { address: address },
      update: {},
      create: { userId: user.id, address: address, isPrimary: true },
    });
  }

  const buySol = await getBuyTransaction(user.id, wallet.id, tokenAddress);
  await prisma.transaction.update({
    where: {
      id: buySol.id,
    },
    data: {
      amountSold: amount.toString(),
      status: "sold",
      sellHash: "simulation",
      sellPrice: tokenDetails.priceUsd.toString(),
    },
  });
  const result = await updatePositionOnSell(
    user.id,
    wallet.id,
    tokenAddress,
    amount.toString(),
    tokenDetails.priceUsd.toString()
  );
  console.log("res: ", result);
  console.log("tokenAddress: ", tokenAddress);
};

export const getUserActivePositions = async (telegramId: string) => {
  const user = await getUserFromTelegramId(telegramId);
  const positions = user.positions.filter(
    (position) => position.isSimulation == false
  );
  console.log(positions);
  const wallet = user.wallet.filter((wallet: Wallet) => wallet.isPrimary)[0];
  const userPositions = [];

  const solPrice = (await UserSolSmartWalletClass.getSolPrice()).solUsdPrice;

  try {
    const tokenListPosition: { tokenName: string; address: string }[] = [];
    for (const position of positions) {
      const tokenDetails = await getTokenDetails(position.tokenAddress);
      tokenListPosition.push({
        tokenName: tokenDetails.name,
        address: position.tokenAddress,
      });
      const PNL_usd = await calculateProfitLoss(
        user.id,
        wallet.id,
        position.tokenAddress,
        tokenDetails.priceUsd.toString()
      );
      const PNL_sol = PNL_usd / solPrice;
      const PNL_Sol_percent = (
        (PNL_sol /
          (parseInt(position.amountHeld) * parseFloat(position.avgBuyPrice))) *
        solPrice *
        100
      ).toFixed(2);

      const balance = await getUserTokenBalance(
        position.tokenAddress,
        telegramId
      );
      const _balance = formatter({
        decimal: 5,
      }).format(balance);

      const currentPrice = formatter({
        decimal: 8,
      }).format(Number(tokenDetails.priceUsd.toString()));

      const currentHolding = formatCurrencyWithoutDollarSign(
        balance * Number(tokenDetails.priceNative)
      );

      const PNL_usd_percent = (
        (PNL_usd /
          (parseInt(position.amountHeld) * parseFloat(position.avgBuyPrice))) *
        100
      ).toFixed(2);

      const data = {
        tokenTicker: position.tokenTicker,
        capital: (
          (parseFloat(position.avgBuyPrice) * parseFloat(position.amountHeld)) /
          solPrice
        ).toFixed(2),
        balance: _balance,
        currentPrice,
        mc: tokenDetails.mc,
        PNL_Sol_percent,
        PNL_usd_percent,
        PNL_usd,
        PNL_sol,
        currentHolding,
        tokenAddress: position.tokenAddress,
        token: tokenDetails,
      };
      userPositions.push(data);
    }

    return userPositions;
  } catch (error) {
    console.log("error: ", error);
    return [];
  }
};

//WITHDRWAL
