'use client';

import { useEffect, useState } from 'react';
import { ClientsTable, Client } from '@/components/ClientsTable';
import { ClientsGrid } from '@/components/ClientsGrid';
import { ClientsDrawer } from '@/components/ClientsDrawer';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'delete' | 'add'>('add');

  const ITEMS_PER_PAGE = 100;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // 🔁 Fetch clients based on user role
  const fetchClientsBasedOnRole = async () => {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user or user not authenticated');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile or role not found');
      return;
    }

    let query = supabase.from('clients').select('*');
    console.log("Query", query);
    switch (profile.role) {
      case 'admin':
        break;
      case 'studio':
      case 'artist':
        query = query.eq('artist_id', user.id);
        break;
      default:
        setClients([]);
        setFiltered([]);
        return;
    }

    const { data: clients, error: clientsError } = await query;

    if (clientsError) {
      console.error('Error fetching clients based on role:', clientsError);
      setClients([]);
      setFiltered([]);
    } else {
      setClients(clients);
      setFiltered(clients);
    }
  };

  useEffect(() => {
    fetchClientsBasedOnRole();
  }, []);

  const handleClientSubmit = async (client: ClientFormData) => {
    const supabase = createClient();

    if (selectedClient) {
      const { error } = await supabase
        .from('clients')
        .update(client)
        .eq('id', selectedClient.id);

      if (error) {
        console.error('Error updating client:', error);
        return;
      }
    } else {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error('Could not get current user:', userError);
        return;
      }

      const { error } = await supabase
        .from('clients')
        .insert([
          {
            ...client,
            created_by: userData.user.id,
          },
        ]);

      if (error) {
        console.error('Error inserting client:', error);
        return;
      }
    }

    await fetchClientsBasedOnRole(); // 👈 Refresh after submission
    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedClient(null);
  };

  const paginated = filtered.length > 0
    ? filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    : [];

  return (
    <div className="p-2 relative">
      <div className="flex flex-col justify-between items-start">
        <div className="w-full flex justify-between items-center py-4">
          <div className="text-left"><h1 className="text-xl">Clients</h1></div>
          <div className="text-right font-bold">
            <button
              onClick={() => {
                setSelectedClient(null);
                setDrawerMode('add');
                setDrawerOpen(true);
              }}
              className="text-xs px-4 py-2 bg-[#313131] text-white rounded-md hover:bg-blue-700"
            >
              + Add Client
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-full text-left">
          {/* <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-6 py-2 rounded-md w-full md:w-64 text-xs"
          /> */}
        </div>
      </div>

      {filtered.length > 0 ? (
        view === 'grid' ? (
          <ClientsGrid
            clients={paginated}
            onEdit={(client) => {
              setSelectedClient(client);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <ClientsTable
            clients={clients}
            onEdit={(client) => {
              setSelectedClient(client);
              setDrawerMode('edit');
              setDrawerOpen(true);
            }}
            onView={(client) => {
              setSelectedClient(client);
              setDrawerMode('view');
              setDrawerOpen(true);
            }}
            onDelete={(client) => {
              setSelectedClient(client);
              setDrawerMode('delete');
              setDrawerOpen(true);
            }}
          />
        )
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <p className="text-center text-gray-500 text-sm">No clients found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <ClientsDrawer
        open={drawerOpen}
        initialData={selectedClient}
        onClose={handleCloseDrawer}
        onSubmit={handleClientSubmit}
        mode={drawerMode}
      />
    </div>
  );
}