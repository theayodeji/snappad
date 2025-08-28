import PendingMessage from "./PendingMessage";
import ConfirmationMessage from "./ConfirmationMessage";
import CancelledMessage from "./CancelledMessage";
import CompletedMessage from "./CompletedMessage";
import ExpiredMessage from "./ExpiredMessage";

export default function StatusHeader({ status, handlePayment }: { status: string, handlePayment: () => void }) {
  return (
    <>
      {status === "pending" && <PendingMessage handlePayment={handlePayment} />}
      {status === "confirmed" && <ConfirmationMessage />}
      {status === "cancelled" && <CancelledMessage />}
      {status === "completed" && <CompletedMessage />}
      {status === "expired" && <ExpiredMessage />}
    </>
  );
}
