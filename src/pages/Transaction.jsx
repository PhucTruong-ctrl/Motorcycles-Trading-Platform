import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";

const formatDate = (dateString) => {
  return format(new Date(dateString), " HH:mm MM-dd-yyyy");
};

const Transaction = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("TRANSACTION")
          .select("*")
          .or(`uid_buyer.eq.${currentUser.id},uid_seller.eq.${currentUser.id}`);

        if (error) throw error;

        const transactionsWithDetails = await Promise.all(
          (data || []).map(async (transaction) => {
            const { data: motoData } = await supabase
              .from("MOTORCYCLE")
              .select("*")
              .eq("id", transaction.id_moto)
              .single();

            const { data: buyerData } = await supabase
              .from("USER")
              .select("*")
              .eq("uid", transaction.uid_buyer)
              .single();

            const { data: sellerData } = await supabase
              .from("USER")
              .select("*")
              .eq("uid", transaction.uid_seller)
              .single();

            return {
              ...transaction,
              motorcycle: motoData,
              buyer: buyerData,
              seller: sellerData,
              type:
                transaction.uid_buyer === currentUser.id ? "Buying" : "Selling",
            };
          })
        );

        setTransactions(transactionsWithDetails);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="my-[15px] mx-[25px]">
      <header className="mb-5">
        <Header />
      </header>

      <div
        id="title"
        className="flex flex-col justify-center items-center w-full gap-2.5 mb-5"
      >
        <span className="text-black font-bold text-4xl">Transaction</span>
        <span className="text-grey font-light text-xl">Track your orders</span>
      </div>

      <div className="flex flex-col items-center gap-2.5 p-2.5 w-full bg-white rounded-xl">
        <div
          id="actionBar-transaction"
          className="flex flex-row p-2.5 justify-between items-center w-full"
        >
          <div
            id="searchBar"
            className="flex p-2.5 items-center gap-2.5 border-1 border-grey rounded-sm"
          >
            <img src="/icons/BlackSearch.svg" alt="" />
            <span className="text-grey">Search by motorcycle id, type...</span>
          </div>
          <div
            id="typeStatusTimeBar-transaction"
            className="flex items-center gap-2.5 p-2.5"
          >
            <div
              id="transactionType"
              className="flex items-center justify-center gap-[5px] p-2.5 rounded-sm border-1 border-grey"
            >
              <span>Transaction Type</span>
              <img src="/icons/SmallDropdown.svg" alt="" />
            </div>
            <div
              id="transactionStatus"
              className="flex items-center justify-center gap-[5px] p-2.5 rounded-sm border-1 border-grey"
            >
              <span>Transaction Status</span>
              <img src="/icons/SmallDropdown.svg" alt="" />
            </div>
            <div
              id="transactionDate"
              className="flex items-center justify-center gap-[5px] p-2.5 rounded-sm border-1 border-grey"
            >
              <img src="/icons/Calendar.svg" alt="" />
              <span>Transaction Date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full py-[15px] gap-[5px]">
        <div
          id="rowType"
          className="flex items-center gap-2.5 p-2.5 w-full bg-white border-1 border-border-white rounded-md"
        >
          <div
            id="transactionCol"
            className="flex items-center p-2.5 gap-[5px] min-w-[300px]"
          >
            <input id="selectTransaction" type="checkbox" />
            <label htmlFor="selectTransaction" className="font-bold">
              Transaction
            </label>
          </div>
          <div
            id="userCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">User</span>
          </div>
          <div
            id="dateCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">Date</span>
          </div>
          <div
            id="typeCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">Type</span>
          </div>
          <div
            id="typeCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">Amount</span>
          </div>
          <div
            id="typeCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">Status</span>
          </div>
          <div
            id="typeCol"
            className="flex items-center p-2.5 gap-[5px] w-full"
          >
            <span className="font-bold">Actions</span>
          </div>
        </div>
        <div
          id="itemsList-transaction"
          className="flex flex-col gap-2.5 w-full"
        >
          {transactions.length === 0 ? (
            <div className="text-center py-10">No transactions found</div>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-2.5 p-2.5 w-full bg-white border-1 border-border-white rounded-md"
              >
                <div className="flex items-center p-2.5 gap-[10px] min-w-[300px]">
                  <input
                    id={`selectTransaction-${transaction.id}`}
                    type="checkbox"
                  />
                  <img
                    src={
                      transaction.motorcycle?.image_url?.[0] ||
                      "/img/R7_Sample.jpg"
                    }
                    alt="Motorcycle"
                    className="rounded-sm w-[40px] h-[40px] object-cover"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <span>
                      {transaction.motorcycle?.brand}{" "}
                      {transaction.motorcycle?.model}
                    </span>
                    <span className="font-light text-[12px]">
                      {transaction.motorcycle?.mile} miles
                    </span>
                  </div>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <img
                    src={
                      transaction.type === "Buying"
                        ? transaction.seller?.avatar_url
                        : transaction.buyer?.avatar_url || "/img/R7_Sample.jpg"
                    }
                    alt="User"
                    className="rounded-sm w-[40px] h-[40px] object-cover"
                  />
                  <span>
                    {transaction.type === "Buying"
                      ? transaction.seller?.name
                      : transaction.buyer?.name}
                  </span>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <span>{formatDate(transaction.created_at)}</span>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <span>{transaction.type}</span>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <span>
                    ${transaction.motorcycle?.price?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <div
                    className={`flex flex-row items-center p-[5px] gap-[5px] rounded-sm ${
                      transaction.completed
                        ? "bg-[#C4FFAE] text-[#1B7200]"
                        : "bg-[#FFECAE] text-[#725C00]"
                    }`}
                  >
                    <img
                      src={`${transaction.completed ? "/icons/CheckCircle.svg" : "/icons/PendingCircle.svg"}`}
                      alt=""
                    />
                    <span>
                      {transaction.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center p-2.5 gap-[5px] w-full">
                  <div className="flex items-center gap-[5px] rounded-sm border-1 border-grey p-[5px]">
                    <span className="text-grey">Detail</span>
                    <img src="/icons/MoreDot.svg" alt="" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </main>
  );
};

export default Transaction;
