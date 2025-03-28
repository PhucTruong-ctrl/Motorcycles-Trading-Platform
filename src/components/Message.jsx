import React, { useState, useEffect, useRef } from "react";
import supabase from "../supabase-client";
import { format } from "date-fns";

const formatDate = (dateString) => {
  return format(new Date(dateString), " HH:mm MM-dd-yyyy");
};

export const Message = ({ newChatReceiver }) => {
  const [loading, setLoading] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [closeMessage, setCloseMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setCurrentUser(session?.user || null);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        console.log("Fetching messages for user:", currentUser.id);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUser?.id) return;

      const { data, error } = await supabase
        .from("MESSAGE")
        .select("uid_send, uid_recv, message, created_at")
        .or(`uid_send.eq.${currentUser.id},uid_recv.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages for contacts:", error);
        return;
      }

      console.log("Raw messages from Supabase:", data);

      const contactsMap = new Map();
      console.log("Contacts Map:", Array.from(contactsMap.entries()));


      data.forEach((msg) => {

        const otherUserId =
          msg.uid_send === currentUser.id ? msg.uid_recv : msg.uid_send;

        if (
          !contactsMap.has(otherUserId) ||
          new Date(msg.created_at) > new Date(contactsMap.get(otherUserId).lastMessageTime)
        ) {
          contactsMap.set(otherUserId, {
            uid: otherUserId,
            lastMessageTime: msg.created_at,
            lastMessage: msg.message,
            sender: msg.uid_send,
          });
        }
      });

      const contactIds = Array.from(contactsMap.keys());

      const { data: users, error: userError } = await supabase
        .from("USER")
        .select("uid, name, avatar_url")
        .in("uid", contactIds);

      if (userError) {
        console.error("Error fetching users:", userError);
        return;
      }

      const contactsWithLastMessage = users.map((user) => ({
        ...user,
        lastMessage: contactsMap.get(user.uid)?.lastMessage,
        sender: contactsMap.get(user.uid)?.sender,
        lastMessageTime: contactsMap.get(user.uid)?.lastMessageTime,
      }));

      setContacts(contactsWithLastMessage);
    };


    fetchContacts();
  }, [currentUser, messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedContact?.uid || !currentUser?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("MESSAGE")
          .select("*")
          .or(
            `and(uid_send.eq.${currentUser.id},uid_recv.eq.${selectedContact.uid}),and(uid_send.eq.${selectedContact.uid},uid_recv.eq.${currentUser.id})`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedContact, currentUser]);

  useEffect(() => {
    if (newChatReceiver) {
      setSelectedContact(newChatReceiver);
      setOpenMessage(true);
    }
  }, [newChatReceiver]);

  useEffect(() => {
    const channel = supabase
      .channel("messages_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "MESSAGE",
          filter: `uid_send=eq.${currentUser?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "MESSAGE",
          filter: `uid_recv=eq.${currentUser?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser?.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser?.id || !selectedContact?.uid) return;

    try {
      const { error } = await supabase.from("MESSAGE").insert({
        uid_send: currentUser.id,
        uid_recv: selectedContact.uid,
        message: newMessage,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed z-10 bottom-0 right-[1%]">
        <div className="bg-white w-[402px] h-[55px] border-2 border-grey rounded-t-xl flex items-center justify-center">
          Please login to use messages
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed z-10 bottom-0 right-[1%]">
        <div className="bg-white w-[402px] h-[55px] border-2 border-grey rounded-t-xl flex items-center justify-center">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed z-10 bottom-0 right-[1%]">
      {openMessage === false ? (
        <div
          id="MessageList"
          className={`bg-white w-[402px] ${closeMessage ? "h-[55px]" : "h-[428px]"} border-2 border-grey rounded-t-xl`}
        >
          <div
            id="MessageListHeader"
            className="flex flex-row justify-between items-center border-b-1 border-grey bg-white w-full p-3 rounded-t-md"
            onClick={() => closeMessage && setCloseMessage(false)}
          >
            <span>Message List</span>
            <button onClick={() => !closeMessage && setCloseMessage(true)}>
              <img src="/icons/Close.svg" alt="Close" />
            </button>
          </div>

          <div id="MessageListBody" className="w-full h-[428px] overflow-y-scroll p-3">
            {contacts.length === 0 ? (
              <div>No conversations yet</div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.uid}
                  className="flex flex-row justify-start items-center gap-2 mb-2 cursor-pointer"
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpenMessage(true);
                  }}
                >
                  {contact.avatar_url ? (
                    <img
                      src={contact.avatar_url}
                      alt={contact.name}
                      className="border w-[30px] h-[30px] rounded-full"
                    />
                  ) : (
                    <div className="border min-w-[30px] min-h-[30px] rounded-full bg-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{contact.name}</div>
                    <div
                      className="text-sm text-gray-500 truncate"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                      }}
                    >
                      {contact.lastMessage
                        ? contact.sender === currentUser.id
                          ? `You: ${contact.lastMessage}`
                          : contact.lastMessage
                        : "No messages yet"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        <div
          id="Message"
          className={`bg-white w-[402px] ${closeMessage ? "h-[55px]" : "h-[428px]"} border-2 border-grey rounded-t-xl`}
        >
          <div
            id="MessageHeader"
            className="flex flex-row justify-between items-center border-b-1 border-grey bg-white w-full p-3 rounded-t-md"
            onClick={() => closeMessage && setCloseMessage(false)}
          >
            <div className="flex flex-row justify-start items-center gap-2">
              <button onClick={() => setOpenMessage(false)}>
                <img src="/icons/NavArrowBackward.svg" alt="Back" />
              </button>
              {selectedContact?.avatar_url ? (
                <img
                  src={selectedContact.avatar_url}
                  alt={selectedContact.name}
                  className="border-2 w-[35px] h-[35px] rounded-full"
                />
              ) : (
                <div className="border-2 w-[35px] h-[35px] rounded-full bg-gray-200" />
              )}
              <span>{selectedContact?.name}</span>
            </div>
            <button onClick={() => !closeMessage && setCloseMessage(true)}>
              <img src="/icons/Close.svg" alt="Close" />
            </button>
          </div>

          <div id="MessageBody" className="w-full h-[300px] overflow-y-scroll p-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 flex ${msg.uid_send === currentUser.id ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`flex flex-col max-w-[70%] p-2 rounded-md ${msg.uid_send === currentUser.id ? "bg-blue-100" : "bg-gray-100"
                    }`}
                >
                  <div>{msg.message}</div>
                  <div className="text-[11px]">{formatDate(msg.created_at)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>


          <form
            onSubmit={handleSendMessage}
            className="fixed w-[398px] border-t-1 border-grey flex flex-row justify-between items-center p-2.5 bg-white"
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              id="MessageInput"
              type="text"
              placeholder="Aa"
              className="h-[45px] w-full text-left p-2.5 border-1 rounded-xl"
            />
            <button
              type="submit"
              className="w-[50px] flex justify-center items-center"
            >
              <img src="/icons/Send.svg" alt="Send" className="w-[30px]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};