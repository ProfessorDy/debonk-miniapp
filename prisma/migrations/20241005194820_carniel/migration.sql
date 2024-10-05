-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('none', 'bought', 'sold');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "simulationBalance" DECIMAL(65,30) NOT NULL DEFAULT 10,
    "referredBy" INTEGER NOT NULL DEFAULT 0,
    "referralCountDirect" INTEGER NOT NULL DEFAULT 0,
    "referralCountIndirect" INTEGER NOT NULL DEFAULT 0,
    "referralProfit" DOUBLE PRECISION NOT NULL DEFAULT 0.0000,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "hash" TEXT,
    "chain" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "tokenTicker" TEXT NOT NULL,
    "amountBought" TEXT NOT NULL,
    "transactionType" TEXT,
    "buyHash" TEXT NOT NULL,
    "buyPrice" TEXT NOT NULL,
    "sellHash" TEXT,
    "amountSold" TEXT,
    "sellPrice" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletId" TEXT NOT NULL,
    "isSimulation" BOOLEAN NOT NULL DEFAULT false,
    "tokenAddress" TEXT NOT NULL,
    "tokenTicker" TEXT NOT NULL,
    "amountHeld" TEXT NOT NULL,
    "avgBuyPrice" TEXT NOT NULL,
    "currentValue" TEXT,
    "profitLoss" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTracking" (
    "tokenAddress" TEXT NOT NULL,
    "details" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserTokenTrackingData" (
    "chatId_tokenAddress" TEXT NOT NULL,
    "userTokenGif" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "referralCashOut" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "payoutAddress" TEXT NOT NULL,
    "transactionId" TEXT,
    "payoutHash" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referralCashOut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swap" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "swapMessageId" TEXT NOT NULL,
    "fromCurrency" TEXT,
    "toCurrency" TEXT,
    "fromAmount" TEXT,
    "toAmount" TEXT,
    "fromNetwork" TEXT,
    "toNetwork" TEXT,
    "transactionId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Swap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "TokenTracking_tokenAddress_key" ON "TokenTracking"("tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserTokenTrackingData_chatId_tokenAddress_key" ON "UserTokenTrackingData"("chatId_tokenAddress");

-- CreateIndex
CREATE UNIQUE INDEX "referralCashOut_transactionId_key" ON "referralCashOut"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Swap_swapMessageId_key" ON "Swap"("swapMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "Swap_transactionId_key" ON "Swap"("transactionId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referralCashOut" ADD CONSTRAINT "referralCashOut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swap" ADD CONSTRAINT "Swap_telegramId_fkey" FOREIGN KEY ("telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
