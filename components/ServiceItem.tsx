export function ServiceItem({ service }) {
  return (
    <div className="border rounded-lg px-4 py-2 flex justify-between items-center bg-black text-white">
      <div>
        <div className="font-semibold">{service.name}</div>
        <div className="text-sm text-gray-400">${service.price} – {service.duration} min</div>
      </div>
      <button className="btn-icon">
        ✏️
      </button>
    </div>
  );
}