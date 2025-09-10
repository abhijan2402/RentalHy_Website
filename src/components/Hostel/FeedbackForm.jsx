import React, { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

// Feedback keys from your schema
const FEEDBACK_FIELDS = [
  { key: "food_good", label: "Food is good?" },
  { key: "room_clean", label: "Room Cleanliness is good?" },
  { key: "staff_good", label: "Staff is good?" },
  { key: "safe_stay", label: "Safe to stay?" },
];

const defaultFeedbackState = FEEDBACK_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.key]: 0 }),
  {}
);

export const FeedbackForm = ({ hostelId, onSubmit }) => {
  const [feedback, setFeedback] = useState(defaultFeedbackState);
  const [additionalFeedback, setAdditionalFeedback] = useState("");

  const handleToggle = (fieldKey) => {
    setFeedback((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey] ? 0 : 1,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      hostel_id: hostelId,
      ...feedback,
      additional_feedback: additionalFeedback,
    };
    if (onSubmit) onSubmit(payload);
    // You can put API call here!
  };

  return (
    <div className="border px-4 rounded-md">
      <form onSubmit={handleSubmit}>
        <h3>Please provide feedback</h3>
        {FEEDBACK_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
          >
            <span style={{ flex: 1, color: "black", fontSize: "14px" }}>
              {label}
            </span>
            <span style={{ marginRight: 10, color: "#7C0902" }}>
              {feedback[key]}
            </span>
            <FaThumbsUp
              size={20}
              onClick={() => handleToggle(key)}
              style={{
                cursor: "pointer",
                color: feedback[key] ? "#c00" : "#aaa",
                transition: "color 0.2s",
              }}
              aria-label={`Give thumbs up for ${label}`}
            />
          </div>
        ))}
        <div style={{ marginBottom: 12 }}>
          <label className="text-black text-sm">
            Additional Feedback
            <textarea
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="write your feedback..."
              style={{
                width: "100%",
                minHeight: 64,
                marginTop: 4,
                color: "black",
                padding: "4px 8px",
                fontSize: "14px",
                outline: "none",
                border: "1px solid grey",
                borderRadius: "8px",
              }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#7C0902",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            fontSize: "14px",
          }}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};
