import React, { useState } from "react";
export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const clearUser = () => {
    setCurrentUser(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };
  const user = {
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    clearUser: clearUser,
  };
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
