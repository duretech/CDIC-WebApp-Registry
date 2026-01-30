// 📁 src/components/PakMedicationDropdown.jsx

import React, { useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert";

const PakMedicationDropdown = ({
  staticOptions,
  loadOptions,
  onSelect, // callback to parent
  t,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectResetKey, setSelectResetKey] = useState(0);
  const selectRef = useRef(null);
  const selectedOptionRef = useRef(null);

  const handleCustomInput = async (value) => {
    const exists = staticOptions.some(
      (opt) => opt.label.toLowerCase() === value.toLowerCase()
    );

    if (!exists && value.trim() !== "") {
      const confirm = await Swal({
        title: "Custom Medication",
        text: `"${value}" is not in the list. Would you like to proceed anyway?`,
        icon: "warning",
        buttons: ["No", "Yes"],
      });

      if (confirm) {
        const customOption = {
          type: "Others",
          value,
          label: value,
        };
        setInputValue("")
        setSelectedOption(customOption);
        onSelect(customOption);
      } else {
        setInputValue("")
        setSelectedOption(null);
        setSelectResetKey((prev) => prev + 1);
      }
    }
  };

  const isExactMatch = (value) => {
    return staticOptions.some(
      (opt) => opt.label.toLowerCase() === value.toLowerCase()
    );
  };

  const handleChange = (option) => {
    
    selectedOptionRef.current = option;   // instant write
    setSelectedOption(option);
    setInputValue("");

    // Pass selected option to parent
    onSelect(option);
  };

  const handleInputChange = (value, { action }) => {
    if (action === "input-change") {
      selectedOptionRef.current = null
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    if (!inputValue) return;
    if (isExactMatch(inputValue)) return;
    if (selectedOptionRef.current) return;  // FIX
    handleCustomInput(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!inputValue) return;
      if (isExactMatch(inputValue)) return;
      if (selectedOptionRef.current) return;  // FIX
      e.preventDefault();
      handleCustomInput(inputValue);
    }
  };

  return (
    <div key={selectResetKey}>
      <AsyncSelect
        ref={selectRef}
        cacheOptions
        defaultOptions={staticOptions}
        loadOptions={loadOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        value={selectedOption}
        placeholder={t("Search...")}
        className="custom-SelectBox"
        classNamePrefix="custom-Select"
      />
    </div>
  );
};

export default PakMedicationDropdown;
