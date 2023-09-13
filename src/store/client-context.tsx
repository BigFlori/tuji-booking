import { deleteClientDb, fetchClientsById, readClients, saveClientDb } from "@/firebase/firestore-helpers/utils";
import Client from "@/models/client-model";
import React, { useContext, useEffect, useState } from "react";
import { useAuthContext, useUser } from "./user-context";
import { normalizeText } from "@/utils/helpers";

interface IClientContextObject {
  clients: Client[];
  isFetching: boolean;
  setClients: (clients: Client[]) => void;
  // fetchClients: (clientIds: string[]) => void;
  addClient: (client: Client) => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, client: Client) => void;
  getClientById: (id?: string) => Client | undefined;
  searchClients: (searchText: string) => Client[];
}

export const ClientContext = React.createContext<IClientContextObject>({
  clients: [],
  isFetching: false,
  setClients: () => {},
  // fetchClients: () => {},
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
  const authCtx = useAuthContext();

  const [isFetching, setIsFetching] = useState(false);

  //Loading clients
  useEffect(() => {
    if (!user || !authCtx.initialUserDataChecked) {
      setClients([]);
      return;
    }
    readClients(user).then((clients) => {
      setClients(clients);
    });
  }, [authCtx.initialUserDataChecked]);

  // const fetchClients = async (clientIds: string[]) => {
  //   if (!user || !authCtx.initialUserDataChecked) {
  //     setClients([]);
  //     return;
  //   }
  //   const notLoadedClients = clientIds.filter((clientId) => !clients.find((client) => client.id === clientId));
  //   if (notLoadedClients.length === 0) {
  //     return;
  //   }
  //   setIsFetching(true);
  //   fetchClientsById(user, notLoadedClients).then((clients) => {
  //     setClients((prevState) => [...prevState, ...clients]);
  //   }).finally(() => {
  //     setIsFetching(false);
  //   });
  // };

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
    isFetching,
    setClients,
    // fetchClients,
    addClient,
    removeClient,
    updateClient,
    getClientById,
    searchClients,
  };

  return <ClientContext.Provider value={context}>{props.children}</ClientContext.Provider>;
};

export default ClientContextProvider;
