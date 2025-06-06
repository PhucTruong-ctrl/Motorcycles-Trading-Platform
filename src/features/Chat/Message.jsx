import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import supabase from "../../lib/supabase-client";
import Modal from "react-modal";
import { formatDate } from "../../utils/FormatThings";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Loading from "../../components/ui/Loading"

Modal.setAppElement("#root"); // Set the app element for accessibility

export const Message = ({ newChatReceiver }) => {
  const [loading, setLoading] = useState(false); // Loading state for fetching messages
  const [isMobile, setIsMobile] = useState(false); // State to check if the screen is mobile
  const [openMessage, setOpenMessage] = useState(false); // State to control the visibility of the message window
  const [closeMessage, setCloseMessage] = useState(true); // State to control the visibility of the message list
  const currentUser = useCurrentUser(); // Get the current user from the custom hook
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State to store the new message input
  const [contacts, setContacts] = useState([]); // State to store contacts
  const [selectedContact, setSelectedContact] = useState(null); // State to store the selected contact
  const messagesEndRef = useRef(null); // Ref to scroll to the bottom of the message list

  const handleSendMessage = async (e) => { // Handle sending a message
    e.preventDefault(); // Prevent default form submission
    if (!newMessage.trim() || !currentUser?.id || !selectedContact?.uid) return; // Check if message is empty or user/receiver is not selected

    try { // Send message to the database
      const { error } = await supabase.from("MESSAGE").insert({
        uid_send: currentUser.id,
        uid_recv: selectedContact.uid,
        message: newMessage,
      });

      if (error) throw error; // Check for errors
      setNewMessage("");
    } catch (error) { // Handle errors
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => { // Scroll to the bottom of the message list
    setTimeout(() => { // Delay to ensure the messages are loaded
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  useEffect(() => { // Scroll to the bottom when the message list is opened
    if (openMessage) {
      scrollToBottom();
    }
  }, [openMessage, selectedContact]);

  useEffect(() => { // Scroll to the bottom when new messages are received
    scrollToBottom();
  }, [messages]);

  useEffect(() => { // Fetch contacts when the component mounts or when currentUser changes
    const fetchContacts = async () => {
      if (!currentUser?.id) return;

      const { data, error } = await supabase // Fetch messages where the current user is either sender or receiver
        .from("MESSAGE")
        .select("uid_send, uid_recv, message, created_at")
        .or(`uid_send.eq.${currentUser.id},uid_recv.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages for contacts:", error);
        return;
      }
      
      const contactsMap = new Map(); // to store unique contacts

      data.forEach((msg) => {
        const otherUserId =
          msg.uid_send === currentUser.id ? msg.uid_recv : msg.uid_send; // get the other user id

        if ( // check if the contact is not already in the map
          !contactsMap.has(otherUserId) ||
          new Date(msg.created_at) >
            new Date(contactsMap.get(otherUserId).lastMessageTime) // compare the last message time
        ) {
          contactsMap.set(otherUserId, { // add new contact
            uid: otherUserId, 
            lastMessageTime: msg.created_at,
            lastMessage: msg.message,
            sender: msg.uid_send,
          });
        }
      });

      const contactIds = Array.from(contactsMap.keys()); // get the unique contact ids

      const { data: users, error: userError } = await supabase // Fetch user details for the unique contact ids
        .from("USER")
        .select("uid, name, avatar_url")
        .in("uid", contactIds); // use .in to fetch multiple users at once

      if (userError) {
        console.error("Error fetching users:", userError);
        return;
      }

      const contactsWithLastMessage = users.map((user) => ({ // map user data to include last message
        ...user,
        lastMessage: contactsMap.get(user.uid)?.lastMessage,
        sender: contactsMap.get(user.uid)?.sender,
        lastMessageTime: contactsMap.get(user.uid)?.lastMessageTime,
      }));

      setContacts(contactsWithLastMessage); // set the contacts state
    };

    fetchContacts(); // Fetch contacts when the component mounts or when currentUser changes
  }, [currentUser, messages]);

  useEffect(() => { // Fetch messages when the selected contact changes
    const fetchMessages = async () => { // Fetch messages for the selected contact
      if (!selectedContact?.uid || !currentUser?.id) return;

      setLoading(true); // Set loading state to true
      try { // Fetch messages from the database
        const { data, error } = await supabase // Fetch messages where the current user is either sender or receiver
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

  useEffect(() => { // Open message window if newChatReceiver is provided
    if (newChatReceiver) {
      setSelectedContact(newChatReceiver);
      setOpenMessage(true);
    }
  }, [newChatReceiver]);

  useEffect(() => { // Subscribe to message changes in the database
    const channel = supabase
      .channel("messages_changes") // Create a new channel for message changes
      .on( // Listen for changes in the MESSAGE table
        "postgres_changes", // Listen for changes in the MESSAGE table
        {
          event: "*",
          schema: "public",
          table: "MESSAGE",
          filter: `uid_send=eq.${currentUser?.id}`, // Filter for messages sent by the current user
        },
        (payload) => { // Handle message changes
          if (payload.eventType === "INSERT") { // If a new message is inserted
            setMessages((prev) => [...prev, payload.new]); // Add the new message to the messages state
          }
        }
      )
      .on( // Listen for changes in the MESSAGE table
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "MESSAGE",
          filter: `uid_recv=eq.${currentUser?.id}`, // Filter for messages received by the current user
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]) // Add the new message to the messages state
          }
        }
      )
      .subscribe(); // Subscribe to the channel

    return () => supabase.removeChannel(channel); // Unsubscribe from the channel when the component unmounts
  }, [currentUser?.id]);

  useEffect(() => { // Check if the screen size is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => { // Handle body overflow when the message window is open
    if ((!closeMessage && isMobile) || (openMessage && isMobile)) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [closeMessage, openMessage, isMobile]);
  return ( // Render the message component
    currentUser !== null && (
      <div className="fixed z-1001 bottom-3 md:bottom-0 right-3 md:right-0">
        {/* <audio
          id="notification-sound"
          src="/sounds/notificationMessage.mp3"
          preload="auto"
        ></audio> */}
        {openMessage === false ? (
          <div> {/* Message access */}
            <div 
              id="MessageList"
              className={`bg-white w-[402px] ${closeMessage ? "h-[50px]" : "min-h-[428px]"} border-2 border-grey rounded-t-xl hidden md:block`}
            > {/* Message access for desktop */}
              <div
                id="MessageListHeader"
                className="flex flex-row justify-between items-center border-b-1 border-grey bg-white w-full p-3 rounded-t-md"
                onClick={() => setCloseMessage((prev) => !prev)}
              >
                <span>Message List</span>
              </div>

              {!currentUser ? (
                <div className="p-3">Please login to use messages</div>
              ) : (
                <div
                  id="MessageListBody"
                  className="w-full overflow-y-scroll p-3 flex flex-col gap-2 "
                > {/* Contact list for desktop*/}
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
                            className="border w-[50px] h-[50px] rounded-full"
                          />
                        ) : (
                          <div className="border min-w-[30px] min-h-[30px] rounded-full bg-gray-200" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {contact.name}
                          </div>
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
              )}
            </div>
            <div className="block md:hidden"> {/* Message access for mobile */}
              <button
                onClick={() => setCloseMessage((prev) => !prev)}
                id="MobileMessageButton"
                className="bg-white outline-1 outline-grey w-10 h-10 rounded-full flex justify-center items-center"
              >
                <img src="/icons/BlackChat.svg" alt="" />
              </button>
              <Modal 
                isOpen={!closeMessage}
                onRequestClose={() => {
                  setCloseMessage(true);
                }}
                contentLabel="Edit Profile"
                className="absolute flex flex-col justify-center items-center md:hidden w-full h-[95vh] bottom-0"
                overlayClassName="z-1000 fixed inset-0 bg-[#fff]/75 block md:hidden pointer-events-auto"
                shouldCloseOnOverlayClick={true}
              >
                <div className="relative bg-white outline-1 outline-grey rounded-xl w-[90%] h-[90%] flex flex-col gap-5 justify-start items-start p-5">
                  <span className="text-2xl font-bold">Message</span>
                  <div className="bg-grey w-full h-[1px]"></div>
                  {!currentUser ? (
                    <div className="p-3">Please login to use messages</div>
                  ) : (
                    <div
                      id="MobileMessageListBody"
                      className="w-full overflow-y-scroll flex flex-col gap-2"
                    > {/* Contact list for mobile */}
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
                              setCloseMessage(true);
                            }}
                          >
                            {contact.avatar_url ? (
                              <img
                                src={contact.avatar_url}
                                alt={contact.name}
                                className="border w-[50px] h-[50px] rounded-full"
                              />
                            ) : (
                              <div className="border w-[50px] h-[50px] rounded-full bg-gray-200" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[18px] truncate">
                                {contact.name}
                              </div>
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
                  )}
                </div>
              </Modal>
            </div>
          </div>
        ) : (
          <div> {/* Message window */}
            <div
              id="DesktopMessage"
              className={`bg-white w-[402px] ${closeMessage ? "h-[55px]" : "h-[428px]"} border-2 border-grey rounded-t-xl hidden md:block`}
            >
              {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loading />
                </div>
              ) : (
                <div>
                  {" "}
                  <div
                    id="MessageHeader"
                    className="flex flex-row justify-between items-center border-b-1 border-grey bg-white w-full p-3 rounded-t-md"
                    onClick={() => setCloseMessage((prev) => !prev)}
                  >
                    <div className="flex flex-row justify-start items-center gap-2">
                      <button onClick={() => setOpenMessage(false)}>
                        <img src="/icons/NavArrowBackward.svg" alt="Back" />
                      </button>
                      {selectedContact?.avatar_url ? (
                        <img
                          src={selectedContact.avatar_url}
                          alt={selectedContact.name}
                          className="border-1 w-[35px] h-[35px] rounded-full"
                        />
                      ) : (
                        <div className="border-2 w-[35px] h-[35px] rounded-full bg-gray-200" />
                      )}
                      <Link to={`/profile/${selectedContact?.uid}`}>{selectedContact?.name}</Link>
                    </div>
                  </div>
                  <div
                    id="MessageBody"
                    className="w-full h-[300px] overflow-y-auto p-3"
                    ref={(el) => {
                      if (el) {
                        setTimeout(() => {
                          el.scrollTop = el.scrollHeight;
                        }, 300);
                      }
                    }}
                  >
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`my-2 flex ${
                          msg.uid_send === currentUser.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex flex-col max-w-[70%] p-2 rounded-md ${
                            msg.uid_send === currentUser.id
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <div>{msg.message}</div>
                          <div className="text-[11px]">
                            {formatDate(msg.created_at)}
                          </div>
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
                      <img
                        src="/icons/Send.svg"
                        alt="Send"
                        className="w-[30px]"
                      />
                    </button>
                  </form>
                </div>
              )}
            </div>
            <div id="MobileMessage" className="block md:hidden">
              <button
                onClick={() => setOpenMessage((prev) => !prev)}
                id="MobileMessageButton"
                className="bg-white outline-1 outline-grey w-12 h-12 rounded-full flex justify-center items-center"
              >
                <img src="/icons/BlackChat.svg" alt="" />
              </button>
              <Modal
                isOpen={openMessage}
                onRequestClose={() => {
                  setOpenMessage(false);
                }}
                contentLabel="Edit Profile"
                className="absolute flex flex-col justify-center items-center md:hidden w-full h-[95vh] bottom-0"
                overlayClassName="z-1000 fixed inset-0 bg-[#fff]/75 block md:hidden pointer-events-auto"
                shouldCloseOnOverlayClick={true}
              >
                <div className=" bg-white outline-1 outline-grey rounded-xl w-[90%] h-[90%] flex flex-col gap-2.5 justify-start items-start p-2.5">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="relative w-full h-full">
                      <div
                        id="MobileMessageHeader"
                        className="flex flex-row justify-between items-center border-b-1 border-grey bg-white w-full p-3 rounded-t-md"
                      >
                        <div className="flex flex-row justify-start items-center gap-2">
                          <button
                            onClick={() => {
                              setOpenMessage(false);
                              setCloseMessage(false);
                            }}
                          >
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
                          <Link to={`/profile/${selectedContact?.uid}`}>{selectedContact?.name}</Link>
                        </div>
                      </div>

                      <div
                        id="MobileMessageBody"
                        className="w-full h-[calc(100%-120px)] overflow-y-auto p-3"
                        ref={(el) => {
                          if (el) {
                            setTimeout(() => {
                              el.scrollTop = el.scrollHeight;
                            }, 300);
                          }
                        }}
                      >
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`my-2 flex ${
                              msg.uid_send === currentUser.id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`break-all flex flex-col max-w-[70%] p-2 rounded-md ${
                                msg.uid_send === currentUser.id
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div>{msg.message}</div>
                              <div className="text-[11px]">
                                {formatDate(msg.created_at)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      <form
                        onSubmit={handleSendMessage}
                        className="w-full border-t-1 border-grey flex flex-row justify-between items-center p-2.5 bg-white"
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
                          <img
                            src="/icons/Send.svg"
                            alt="Send"
                            className="w-[30px]"
                          />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </Modal>
            </div>
          </div>
        )}
      </div>
    )
  );
};
