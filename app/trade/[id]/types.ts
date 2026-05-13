export type Trade = {
    _id: string;
    assetName: string;
    ticker: string;
    tradeType: "Buy" | "Sell";
    quantity: number;
    currency: string;
    pricePerUnit: number;
    tradeDate: string;
    reason?: string;
    createdAt: string;
};

export type Analysis = {
    _id: string;
    tradeId: string;
    sentiment: string;
    rationalityScore: number;
    ai_feedback: string;
    users_response_to_ai: string;
    createdAt?: string;
};
