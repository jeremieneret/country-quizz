export default function TimerBar({ timeLeft, duration = 10 }) {
  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="timer-bar-wrapper">
      <div
        className="timer-bar-fill"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
