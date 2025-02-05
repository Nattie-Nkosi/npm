interface FeedbackProps {
  type: "success" | "error";
  message: string;
  onRetry?: () => void;
}

export function Feedback({ type, message, onRetry }: FeedbackProps) {
  return (
    <div className={`feedback feedback-${type}`}>
      <p>{message}</p>
      {type === "error" && onRetry && (
        <button onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
}
