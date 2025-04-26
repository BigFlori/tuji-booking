import { db } from "@/firebase/firebase.config";
import Client from "@/models/client-model";
import { User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

// Lekérdezi a felhasználó ügyfeleit
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

// Elmenti az ügyfelet
export const saveClientDb = async (user: User, client: Client) => {
  const clientRef = doc(db, "users", user.uid, "clients", client.id);
  await setDoc(clientRef, client);
};

// Törli az ügyfelet
export const deleteClientDb = async (user: User, clientId: string) => {
  const clientRef = doc(db, "users", user.uid, "clients", clientId);
  await deleteDoc(clientRef);
};
