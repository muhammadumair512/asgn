import React, { createContext, useContext, ReactNode, useState } from "react";
import { User } from "./services/userService";
// Update the DataContextType to store a User object instead of just a string
interface DataContextType {
  user: User | undefined; // Change this from string to User
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>; // Change this to accept User or undefined
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined); // Initialize state with User or undefined

  return (
    <DataContext.Provider value={{ user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const UseData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
