import React, { useState, useEffect } from "react";
import { Link } from "react-router";
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
    sortBy: "Default",
    type: "All",
    status: "All",
    date: "Newest",
  });

  const filterOptions = {
    sortBy: [
      { value: "Newest", label: "Newest First" },
      { value: "Oldest", label: "Oldest First" },
      { value: "Highest", label: "Highest Price" },
      { value: "Lowest", label: "Lowest Price" },
    ],
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

    const channel = supabase
      .channel("transaction-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "TRANSACTION",
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      switch (filters.sortBy) {
        case "Newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "Oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "Highest":
          return (b.motorcycle?.price || 0) - (a.motorcycle?.price || 0);
        case "Lowest":
          return (a.motorcycle?.price || 0) - (b.motorcycle?.price || 0);
        default:
          return 0;
      }
    });

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSold = async (id, motoId) => {
    try {
      const { data: transactionData, error: transactionError } = await supabase
        .from("TRANSACTION")
        .select("*")
        .eq("id", id)
        .single();

      if (transactionError) throw transactionError;

      const sellerId = transactionData.uid_seller;

      const { error: updateTransactionError } = await supabase
        .from("TRANSACTION")
        .update({ completed: true })
        .eq("id", id);

      if (updateTransactionError) throw updateTransactionError;

      const { error: motoError } = await supabase
        .from("MOTORCYCLE")
        .update({ is_sold: true })
        .eq("id", motoId);

      if (motoError) throw motoError;

      const { data: sellerData, error: sellerError } = await supabase
        .from("USER")
        .select("sold_list")
        .eq("uid", sellerId)
        .single();

      if (sellerError) throw sellerError;

      const updatedSellerSoldList = sellerData.sold_list
        ? [...sellerData.sold_list, motoId]
        : [motoId];

      await supabase
        .from("USER")
        .update({ sold_list: updatedSellerSoldList })
        .eq("uid", sellerId);
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("Failed to complete transaction");
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
        <span className="text-black font-bold text-4xl">Transactions</span>
        <span className="text-grey font-light text-xl">Track your orders</span>
      </div>

      <div className="flex flex-col items-center gap-2.5 p-2.5 w-full bg-white rounded-xl">
        <div
          id="actionBar-transaction"
          className="flex flex-col md:flex-row p-2.5 justify-between items-center w-full"
        >
          <div
            id="searchBar"
            className="flex p-2.5 items-center gap-2.5 border-1 border-grey rounded-sm"
          >
            <img src="/icons/BlackSearch.svg" alt="" />
            <input
              type="text"
              placeholder="Search by id, brand, model"
              className="text-grey bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            id="typeStatusTimeBar-transaction"
            className="hidden md:grid grid-cols-3 items-center gap-2.5 p-2.5"
          >
            <div className="flex items-center gap-[5px]">
              <div className="flex items-center gap-[5px]">
                <div className="flex items-center gap-[5px]">
                  <Select
                    options={filterOptions.sortBy}
                    defaultValue={filterOptions.sortBy.find(
                      (opt) => opt.value === "Newest"
                    )}
                    isSearchable={false}
                    onChange={(selected) =>
                      handleFilterChange("sortBy", selected.value)
                    }
                    className="w-40 text-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[5px]">
              <Select
                options={filterOptions.type}
                defaultValue={filterOptions.type[0]}
                isSearchable={false}
                onChange={(selected) =>
                  handleFilterChange("type", selected.value)
                }
                className="w-40 text-md"
              />
            </div>

            <div className="flex items-center gap-[5px]">
              <Select
                options={filterOptions.status}
                defaultValue={filterOptions.status[0]}
                isSearchable={false}
                onChange={(selected) =>
                  handleFilterChange("status", selected.value)
                }
                className="w-40 text-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full py-[15px] gap-[5px]">
        <div
          id="rowType"
          className="flex justify-center items-center md:grid md:grid-cols-7 gap-2.5 p-2.5 w-full bg-white border-1 border-border-white rounded-md"
        >
          <div
            id="transactionCol"
            className="flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">Transaction</span>
          </div>
          <div
            id="userCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">User</span>
          </div>
          <div
            id="dateCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">Date</span>
          </div>
          <div
            id="typeCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">Type</span>
          </div>
          <div
            id="amountCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">Amount</span>
          </div>
          <div
            id="statusCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
          >
            <span className="font-bold">Status</span>
          </div>
          <div
            id="actionCol"
            className="hidden md:flex items-center p-2.5 gap-[5px]"
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
              <div>
                <div
                  key={transaction.id}
                  className="hidden md:grid grid-cols-7 gap-2.5 p-2.5 w-full bg-white border-1 border-border-white rounded-md"
                >
                  <div className="flex justify-start items-start p-1 gap-[10px]">
                    <img
                      src={
                        transaction.motorcycle?.image_url?.[0] ||
                        "/img/R7_Sample.jpg"
                      }
                      alt="Motorcycle"
                      className="rounded-sm w-[40px] h-[40px] object-cover"
                    />
                    <div className="flex flex-col justify-start items-start gap-1">
                      <Link
                        to={{
                          pathname: "/motorcycle-detail",
                          search: `?${new URLSearchParams({
                            uid: transaction.motorcycle?.uid || "",
                            id: transaction.motorcycle?.id || "",
                            year: transaction.motorcycle?.year || "",
                            brand: transaction.motorcycle?.brand || "",
                            model: transaction.motorcycle?.model || "",
                            trim: transaction.motorcycle?.trim || "",
                          }).toString()}`,
                        }}
                        className="font-bold text-blue underline"
                      >
                        {transaction.motorcycle?.brand}{" "}
                        {transaction.motorcycle?.model}{" "}
                        {transaction.motorcycle?.trim}
                      </Link>
                      <div className="flex flex-col justify-start items-start gap-0">
                        <span className="font-light text-sm">
                          {transaction.motorcycle?.mile} Miles
                        </span>
                        <span className="font-light text-sm">
                          {transaction.motorcycle?.year}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-1 gap-[5px]">
                    <img
                      src={
                        transaction.type === "Buying"
                          ? transaction.seller?.avatar_url
                          : transaction.buyer?.avatar_url ||
                            "/img/R7_Sample.jpg"
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
                  <div className="flex items-center p-1 gap-[5px]">
                    <span>{formatDate(transaction.created_at)}</span>
                  </div>
                  <div className="flex items-center p-1 gap-[5px]">
                    <span>{transaction.type}</span>
                  </div>
                  <div className="flex items-center p-1 gap-[5px]">
                    <span>
                      ${transaction.motorcycle?.price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <div
                      className={`flex flex-row justify-center items-center p-[5px] gap-[5px] rounded-sm w-fit ${
                        transaction.completed
                          ? "bg-[#C4FFAE] text-[#1B7200]"
                          : "bg-[#FFECAE] text-[#725C00]"
                      }`}
                    >
                      <img
                        src={`${transaction.completed ? "/icons/CheckCircle.svg" : "/icons/PendingCircle.svg"}`}
                        alt=""
                      />
                      <span className="font-light">
                        {transaction.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="relative flex items-center p-2.5 gap-[5px]">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <MenuButton className="flex items-center gap-[5px] rounded-sm border-1 border-grey p-[5px] hover:bg-gray-50">
                          <span className="text-grey">Action</span>
                          <img src="/icons/MoreDot.svg" alt="" />
                        </MenuButton>
                      </div>

                      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-border-white ring-opacity-5 focus:outline-none">
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
                <div className="flex md:hidden justify-center items-start gap-2.5 p-1 w-full bg-white border-1 border-border-white rounded-md">
                  <div className="flex flex-col p-2.5 gap-3 w-full">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-5">
                        <div className="flex flex-col gap-1 justify-center items-center">
                          <img
                            src={
                              transaction.motorcycle?.image_url?.[0] ||
                              "/img/R7_Sample.jpg"
                            }
                            alt="User"
                            className="rounded-sm w-[50px] h-[50px] object-cover"
                          />
                          <div className="w-full h-[1px] bg-grey"></div>
                          <div>
                            {transaction.type === "Buying" ? (
                              <span className="font-light text-sm bg-red text-white p-1 rounded-sm">
                                Buying
                              </span>
                            ) : (
                              <span className="font-light text-sm bg-blue text-white p-1 rounded-sm">
                                Selling
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Link
                            to={{
                              pathname: "/motorcycle-detail",
                              search: `?${new URLSearchParams({
                                uid: transaction.motorcycle?.uid || "",
                                id: transaction.motorcycle?.id || "",
                                year: transaction.motorcycle?.year || "",
                                brand: transaction.motorcycle?.brand || "",
                                model: transaction.motorcycle?.model || "",
                                trim: transaction.motorcycle?.trim || "",
                              }).toString()}`,
                            }}
                            className="font-bold text-blue underline"
                          >
                            {transaction.motorcycle?.brand}{" "}
                            {transaction.motorcycle?.model}
                          </Link>
                          <div className="flex flex-col gap-0">
                            <span className="font-light italic text-sm">
                              {transaction.motorcycle?.trim} Edition
                            </span>
                            <span className="font-light text-sm">
                              {transaction.motorcycle?.mile} Miles
                            </span>
                            <span className="font-light text-sm">
                              {transaction.motorcycle?.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-grey w-full h-[1px]"></div>
                    <div>
                      {transaction.type === "Buying" ? (
                        <span>
                          Buying from{" "}
                          <span className="font-bold text-blue underline">
                            {transaction.seller?.name}
                          </span>
                        </span>
                      ) : (
                        <span>
                          Order from{" "}
                          <span className="font-bold text-blue underline">
                            {transaction.buyer?.name}
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex flex-row justify-center items-center p-[5px] gap-[5px] rounded-sm w-fit ${
                        transaction.completed
                          ? "bg-[#C4FFAE] text-[#1B7200]"
                          : "bg-[#FFECAE] text-[#725C00]"
                      }`}
                    >
                      <img
                        src={`${transaction.completed ? "/icons/CheckCircle.svg" : "/icons/PendingCircle.svg"}`}
                        alt=""
                      />
                      <span className="font-light">
                        {transaction.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 w-40 p-2.5">
                    <button
                      onClick={() => handleChat(transaction)}
                      className="bg-blue flex flex-row gap-1 justify-center items-start p-2.5 rounded-sm "
                    >
                      <img src="/icons/Chat.svg" alt="" />
                      <span className="text-md text-white font-bold">Chat</span>
                    </button>
                    {transaction.type === "Selling" &&
                      transaction.completed === false && (
                        <button
                          onClick={() =>
                            handleSold(transaction.id, transaction.id_moto)
                          }
                          className="bg-[#C4FFAE] flex flex-row gap-1 justify-center items-start p-2.5 rounded-sm "
                        >
                          <img src="/icons/CheckCircle.svg" alt="" />
                          <span className="text-md font-bold text-[#1B7200]">
                            Sold
                          </span>
                        </button>
                      )}
                    <div className="flex items-center p-2.5 gap-[5px] w-full"></div>
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
