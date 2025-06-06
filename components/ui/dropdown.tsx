export default function Dropdown({ options }: { options: string[] }) {
  return (
    <div>
      <label htmlFor="role">I am a:</label>
      <select name="role" id="role" className="border rounded px-2 py-1 w-full">
        <option value="">Choose your role</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}