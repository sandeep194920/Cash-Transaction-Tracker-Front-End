import { useState } from "react";

const useMenu = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const showMenu = () => setIsMenuVisible(true);
  const hideMenu = () => setIsMenuVisible(false);
  return { isMenuVisible, showMenu, hideMenu };
};

export default useMenu;
