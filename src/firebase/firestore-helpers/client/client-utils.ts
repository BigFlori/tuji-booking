import { db } from "@/firebase/firebase.config";
import Client from "@/models/client-model";
import { chunkArray, removeDuplicates } from "@/utils/helpers";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";

export const fetchClientsById = async (user: User, clientIds: string[]) => {
    const uniqueIds = removeDuplicates(clientIds);
    const chunkedArrays = chunkArray(uniqueIds, 30);
    const foundClients: Client[] = [];
  
    for (let i = 0; i < chunkedArrays.length; i++) {
      const queryResult = query(collection(db, "users", user.uid, "clients"), where("id", "in", chunkedArrays[i]));
      await getDocs(queryResult).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!doc.data().hasOwnProperty("id")) return;
          const client = doc.data() as Client;
          if (clientIds.includes(client.id)) {
            foundClients.push(client);
          }
        });
      });
    }
    return foundClients;
  };
  export const readClients = async (user: User) => {
    const clientsRef = collection(db, "users", user.uid, "clients");
    const clients: Client[] = [];
    await getDocs(clientsRef).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (!doc.data().hasOwnProperty("id")) return;
        const client = doc.data() as Client;
        clients.push(client);
      });
    });
    return clients;
  };
  
  export const saveClientDb = async (user: User, client: Client) => {
    const clientRef = doc(db, "users", user.uid, "clients", client.id);
    await setDoc(clientRef, client);
  };
  
  export const deleteClientDb = async (user: User, clientId: string) => {
    const clientRef = doc(db, "users", user.uid, "clients", clientId);
    await deleteDoc(clientRef);
  };