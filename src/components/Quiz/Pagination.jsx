export default function Pagination({ pages, current }) {
  return (
    <div className="pagination">
      {Array.from({ length: pages }).map((_, idx) => (
        <span
          key={idx}
          className={`page ${
            idx <= current ? 'page-completed' : 'page-upcoming'
          }`}
        >
          {idx + 1}
        </span>
      ))}
    </div>
  );
}
