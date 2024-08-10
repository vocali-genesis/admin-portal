import React, { useState } from "react";
import Modal from "react-modal";

const FieldModal = ({ isOpen, onClose, onSave, fieldType }) => {
  const [maxValue, setMaxValue] = useState("");
  const [options, setOptions] = useState("");

  const handleSave = () => {
    if (fieldType === "number") {
      onSave({ maxValue: parseInt(maxValue) });
    } else if (fieldType === "multiselect") {
      onSave({ options: options.split(",").map((o) => o.trim()) });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>{fieldType === "number" ? "Set Max Value" : "Set Options"}</h2>
      {fieldType === "number" ? (
        <input
          type="number"
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
          placeholder="Enter max value"
        />
      ) : (
        <input
          type="text"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          placeholder="Enter options (comma-separated)"
        />
      )}
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default FieldModal;
