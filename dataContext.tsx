import React, { createContext, useState, useContext, ReactNode } from "react";

// Define User type
interface User {
  email: string;
  // Add other user properties if needed
}

// Define the context type
interface DataContextType {
  user: User | null; // Update to match the User type
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Correct type for setState
}

// Create the context with an empty state
const DataContext = createContext<DataContextType | undefined>(undefined);

// Define the provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <DataContext.Provider value={{ user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to use the context
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
