import React from 'react';
import ReactDOM from 'react-dom';
import styles from './dropdown.module.css';

interface IDropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
  isOpen ?: boolean;
  onOpen ?: () => void;
  onClose?: () => void;
}

const NOOP = () => {};

export function Dropdown({ button, children, isOpen, onOpen = NOOP, onClose = NOOP }: IDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(isOpen);
  React.useEffect(() => setIsDropdownOpen(isOpen), [isOpen]);
  React.useEffect(() => isDropdownOpen ? onOpen() : onClose(), [isDropdownOpen]);

  const handleOpen = () => {
    if(isOpen === undefined) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  return (
    <div className={styles.container}>
      <div onClick={handleOpen}>
        { button }
        {isDropdownOpen && (
          <div className={styles.listContainer}>
            <div className={styles.list} onClick={() => setIsDropdownOpen(false)}>
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
