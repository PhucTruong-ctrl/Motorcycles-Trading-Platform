import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Select from "react-select";
import { format } from "date-fns";
import supabase from "../supabase-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Message } from "../components/Message";

const formatDate = (dateString) => {
  return format(new Date(dateString), " HH:mm MM-dd-yyyy");
};

const Transaction = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [messageReceiver, setMessageReceiver] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    date: "All",
  });

  const filterOptions = {
    type: [
      { value: "All", label: "All Types" },
      { value: "Buying", label: "Buying" },
      { value: "Selling", label: "Selling" },
    ],
    status: [
      { value: "All", label: "All Statuses" },
      { value: "Completed", label: "Completed" },
      { value: "In Progress", label: "In Progress" },
    ],
    date: [
      { value: "All", label: "All Dates" },
      { value: "Newest", label: "Newest First" },
      { value: "Oldest", label: "Oldest First" },
    ],
  };

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

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesBrand = transaction.motorcycle?.brand
          ?.toLowerCase()
          .includes(searchLower);
        const matchesModel = transaction.motorcycle?.model
          ?.toLowerCase()
          .includes(searchLower);
        const matchesId = transaction.id_moto?.toString().includes(searchTerm);

        if (!matchesBrand && !matchesModel && !matchesId) {
          return false;
        }
      }

      if (filters.type !== "All" && transaction.type !== filters.type) {
        return false;
      }

      if (filters.status !== "All") {
        const statusMatch =
          filters.status === "Completed"
            ? transaction.completed
            : !transaction.completed;
        if (!statusMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.date === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (filters.date === "Oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSold = async (id, motoId) => {
    try {
      const { error: transactionError } = await supabase
        .from("TRANSACTION")
        .update({ completed: true })
        .eq("id", id);

      if (transactionError) throw transactionError;

      const { error: motoError } = await supabase
        .from("MOTORCYCLE")
        .update({ is_sold: true })
        .eq("id", motoId);

      if (motoError) throw motoError;

      setTransactions(
        transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: true,
                motorcycle: { ...t.motorcycle, is_sold: true },
              }
            : t
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleChat = (transaction) => {
    if (!transaction || !currentUser) return;

    const receiver =
      transaction.uid_buyer === currentUser.id
        ? transaction.seller
        : transaction.buyer;

    if (receiver) {
      setMessageReceiver(receiver);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="my-[15px] mx-[25px]">
      <header className="mb-5">
        <Header />
      </header>
      <Message newChatReceiver={messageReceiver} />
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
            <input
              type="text"
              placeholder="Search by motorcycle id, brand, model..."
              className="text-grey bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            id="typeStatusTimeBar-transaction"
            className="flex items-center gap-2.5 p-2.5"
          >
            <div className="flex items-center gap-[5px]">
              <Select
                options={filterOptions.type}
                defaultValue={filterOptions.type[0]}
                onChange={(selected) =>
                  handleFilterChange("type", selected.value)
                }
                className="w-40 text-sm"
              />
            </div>

            <div className="flex items-center gap-[5px]">
              <Select
                options={filterOptions.status}
                defaultValue={filterOptions.status[0]}
                onChange={(selected) =>
                  handleFilterChange("status", selected.value)
                }
                className="w-40 text-sm"
              />
            </div>

            <div className="flex items-center gap-[5px]">
              <Select
                options={filterOptions.date}
                defaultValue={filterOptions.date[0]}
                onChange={(selected) =>
                  handleFilterChange("date", selected.value)
                }
                className="w-40 text-sm"
              />
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
            filteredTransactions.map((transaction) => (
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
                      {transaction.motorcycle?.model}{" "}
                      {transaction.motorcycle?.trim}
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
                <div className="relative flex items-center p-2.5 gap-[5px] w-full">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="flex items-center gap-[5px] rounded-sm border-1 border-grey p-[5px] hover:bg-gray-50">
                        <span className="text-grey">Action</span>
                        <img src="/icons/MoreDot.svg" alt="" />
                      </MenuButton>
                    </div>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {transaction.type === "Selling" &&
                          transaction.completed === false && (
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSold(
                                      transaction.id,
                                      transaction.id_moto
                                    )
                                  }
                                  className={`${
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700"
                                  } w-full px-4 py-2 text-left text-md flex flex-row gap-2`}
                                >
                                  <img src="/icons/CheckCircle.svg" alt="" />
                                  Mark as Sold
                                </button>
                              )}
                            </MenuItem>
                          )}
                        <MenuItem>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => handleChat(transaction)}
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } w-full px-4 py-2 text-left text-md flex flex-row gap-2`}
                            >
                              <img src="/icons/BlackChat.svg" alt="" />
                              Chat with other user
                            </button>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
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
