import React, { useRef, useEffect } from "react";

function InputSelect({ inputType = "text", autofocus = false, ...props }) {
  const inputRef = useRef(null);
  const handleFocus = (event) => {
    if (
      ["text", "email", "password", "url", "tel", "number"].includes(inputType)
    ) {
      event.target.select();
    }
  };

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autofocus]);
  return (
    <input ref={inputRef} type={inputType} onFocus={handleFocus} {...props} />
  );
}

export default InputSelect;
