type AppFeature = {
  description: string;
  ctt: string | boolean;
  ctt_plus: string | boolean;
};

type AppDataT = {
  appFeatures: AppFeature[];
  subscribeCardFeatures: string[];
};

export const appData: AppDataT = {
  appFeatures: [
    {
      description: "Customers",
      ctt: "10",
      ctt_plus: "Unlimited",
    },
    {
      description: "Transactions",
      ctt: "100",
      ctt_plus: "Unlimited",
    },
    {
      description: "Delete Customer",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Edit Transaction",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Delete Transaction",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Filter by Date, Transaction Amount",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Search by Name, Phone",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Email customer on transaction",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Generate transactions PDF",
      ctt: false,
      ctt_plus: true,
    },
    {
      description: "Provide feedback and request new features",
      ctt: true,
      ctt_plus: true,
    },
  ],
  subscribeCardFeatures: [
    "CTT & CTT+ features",
    "Cancel anytime",
    "24/7 support",
  ],
};
