import { Client } from '../ClientsTable';

interface DeleteClientFormProps {
  initialData: Client;
  onDelete: (client: Client) => Promise<void>;
  onClose: () => void;
}

export function DeleteClientForm({ initialData, onDelete, onClose }: DeleteClientFormProps) {
  const handleDelete = async () => {
    await onDelete(initialData);
  };

  return (
    <div>
      <div className="bg-[#3A3A3A] p-3 rounded mb-4">
        <span className="p-1 text-[#808080] text-xs">
          You are preparing to delete all information within Scheddy for your client{' '}
          <strong className="text-white">
            {initialData.first_name} {initialData.last_name}
          </strong>
          . Are you sure that you want to do this?
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-xs text-white"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
}
