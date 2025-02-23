import { Client, Account, Databases, Query, ID, Storage } from "appwrite"

const client: Client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("67ad93cc00138d79087a")

const account: Account = new Account(client)
const databases: Databases = new Databases(client)
const storage: Storage = new Storage(client)

export { client, account, databases, storage, Query, ID }
