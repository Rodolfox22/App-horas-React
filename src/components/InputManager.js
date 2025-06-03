import React, { useRef, useEffect } from "react";

function InpuSelect({ inputType = "text", autofocus = false, ...props }) {
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

export default InpuSelect;

function SelectContentEditable(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export { SelectContentEditable };
