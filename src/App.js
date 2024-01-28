import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function updateFriendsList(newFriend) {
    setFriendsList((friendsList) => [...friendsList, newFriend]);
    setShowAddFriend(false);
  }
  function handleOnClickShowAddFriend() {
    setShowAddFriend((currWinStatus) => !currWinStatus);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriendsList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          updateFriendsList={updateFriendsList}
          friendsList={friendsList}
          updateSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            updateFriendsList={updateFriendsList}
            friendsList={friendsList}
          />
        )}
        <Button onClick={handleOnClickShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FriendsList({
  updateFriendsList,
  friendsList,
  updateSelectedFriend,
  selectedFriend,
}) {
  return (
    <ul>
      {friendsList.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          updateSelectedFriend={updateSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, updateSelectedFriend, selectedFriend }) {
  let isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(Number(friend.balance))}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          ${friend.name} owes you ${Math.abs(Number(friend.balance))}
        </p>
      )}
      {friend.balance === 0 && <p>you and ${friend.name} are even</p>}
      <Button onClick={() => updateSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ updateFriendsList, friendsList }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const id = crypto.randomUUID();
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    updateFriendsList(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <div>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label> 👯‍♂️ Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label> 🌄 Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUsere, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUsere : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUsere) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUsere);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label> 🌄 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label> 🌄 Your expense</label>
      <input
        type="text"
        value={paidByUsere}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUsere : Number(e.target.value)
          )
        }
      />
      <label> 🌄 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label> 🌄Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">user</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
