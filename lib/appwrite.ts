import { Client, Account, Databases, Storage } from "appwrite"

const client = new Client()

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67a19ec80028558214f2")

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export { ID } from "appwrite"


