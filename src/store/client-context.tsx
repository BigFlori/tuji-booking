import Client from "@/models/client-model";
import React from "react";

interface IClientContextObject {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, client: Client) => void;
  getClientById: (id?: string) => Client | undefined;
};

export const ClientContext = React.createContext<IClientContextObject>({
  clients: [],
  setClients: () => {},
  addClient: () => {},
  removeClient: () => {},
  updateClient: () => {},
  getClientById: () => undefined,
});

const ClientContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [clients, setClients] = React.useState<Client[]>([
    {
      id: "1",
      name: "Ügyfél 1",
      email: "client1@gmail.com",
      phone: "06301234567",
      address: "Budapest, 1111, Fő utca 1.",
    },
    {
      id: "2",
      name: "Ügyfél 2",
      phone: "06301234567",
      address: "Budapest, 1111, Fő utca 100.",
    },
    {
      id: "3",
      name: "Ügyfél 3",
      email: "client3@gmail.com",
    },
    {
      id: "4",
      name: "Molnár Flórián",
      email: "florian00m14@gmail.com",
      phone: "+36302508322",
      address: "Kőszeg, Kossuth Lajos u. 17",
    },
  ]);

  const addClient = (client: Client) => {
    setClients((prevClients) => {
      return [...prevClients, client];
    });
  };

  const removeClient = (id: string) => {
    setClients((prevClients) => {
      return prevClients.filter((client) => client.id !== id);
    });
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
  };

  const getClientById = (id?: string) => {
    if (!id) {
      return undefined;
    }
    return clients.find((client) => client.id === id) || undefined;
  };

  const context: IClientContextObject = {
    clients,
    setClients,
    addClient,
    removeClient,
    updateClient,
    getClientById,
  };

  return <ClientContext.Provider value={context}>{props.children}</ClientContext.Provider>;
};

export default ClientContextProvider;
