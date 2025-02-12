// import { Client, Account } from 'appwrite';

// export const client = new Client();

// client
//     .setEndpoint('https://cloud.appwrite.io/v1')
//     .setProject('67a19ec80028558214f2'); // Replace with your project ID

// export const account = new Account(client);
// export { ID } from 'appwrite';


import { Client, Account, Databases, Query, ID } from "appwrite"

const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("67a19ec80028558214f2")

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases, Query, ID }

