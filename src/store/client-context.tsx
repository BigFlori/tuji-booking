import { deleteClientDb, readClients, saveClientDb } from "@/firebase/firestore-helpers/client/client-utils";
import Client from "@/models/client-model";
import React, { useContext, useState } from "react";
import { useUser } from "./user-context";
import { normalizeText } from "@/utils/helpers";
import { useQuery } from "react-query";

interface IClientContextObject {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, client: Client) => void;
  getClientById: (id?: string) => Client | undefined;
  searchClients: (searchText: string) => Client[];
}

export const ClientContext = React.createContext<IClientContextObject>({
  clients: [],
  setClients: () => {},
  addClient: () => {},
  removeClient: () => {},
  updateClient: () => {},
  getClientById: () => undefined,
  searchClients: () => [],
});

export const useClientContext = () => {
  return useContext(ClientContext);
};

const ClientContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const user = useUser();

  const query = useQuery({
    queryKey: ["clients", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      return readClients(user);
    },
    refetchOnWindowFocus: false,
    onSuccess(data) {
      data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(data);
    },
    onError(error) {
      setClients([]);
      console.error(error);
    },
  });

  //Elmenti a váltztatásokat, és létrehozza az ügyfelet ha még nem létezik
  const saveClient = async (client: Client) => {
    if (!user) {
      return;
    }
    saveClientDb(user, client);
  };

  //Az ügyfelet teljesen kitörli az adatbázisból
  const deleteClient = async (id: string) => {
    if (!user) {
      return;
    }
    deleteClientDb(user, id);
  };

  const addClient = (client: Client) => {
    setClients((prevClients) => {
      return [...prevClients, client];
    });
    saveClient(client);
  };

  const removeClient = (id: string) => {
    setClients((prevClients) => {
      return prevClients.filter((client) => client.id !== id);
    });
    deleteClient(id);
  };

  const updateClient = (id: string, client: Client) => {
    setClients((prevClients) => {
      return prevClients.map((prevClient) => {
        if (prevClient.id === id) {
          return client;
        }
        return prevClient;
      });
    });
    saveClient(client);
  };

  const getClientById = (id?: string) => {
    if (!id) {
      return undefined;
    }
    return clients.find((client) => client.id === id) || undefined;
  };

  const searchClients = (searchText: string) => {
    return clients.filter((client) => {
      const normalizedName = normalizeText(client.name);
      const normalizedSearchText = normalizeText(searchText);
      return normalizedName.includes(normalizedSearchText);
    });
  };

  const context: IClientContextObject = {
    clients,
    setClients,
    addClient,
    removeClient,
    updateClient,
    getClientById,
    searchClients,
  };

  return <ClientContext.Provider value={context}>{props.children}</ClientContext.Provider>;
};

export default ClientContextProvider;
