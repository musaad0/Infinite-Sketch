export default function AppBarButton({ onClick, children }) {
  return (
    <button
      type="button"
      className="no-drag minimize block py-1.5 px-3 outline-none focus-within:ring-0 hover:cursor-pointer hover:bg-neutral-700 hover:fill-neutral-400 last:hover:bg-[#dc2626] last:hover:fill-[#fecaca] focus:ring-0"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
