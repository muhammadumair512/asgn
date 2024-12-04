import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../../services/userService";
import styles from "./sidebar.module.css";

interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
}

const Sidebar: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", age: 0 });

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };
    getUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addedUser = await createUser(newUser);
    setUsers([...users, addedUser]);
    setNewUser({ name: "", email: "", age: 0 });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Users</h1>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user._id} className={styles.userItem}>
            {`${user.name} (${user.age}) - ${user.email}`}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) =>
            setNewUser({ ...newUser, age: Number(e.target.value) })
          }
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Add User
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
