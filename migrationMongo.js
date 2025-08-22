import { MongoClient, ObjectId } from "mongodb";

async function migrateIds() {
  const nameUser = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const url = process.env.MONGODB_URL;
  const nameDb = process.env.MONGODB_DB;

  const DBURI = `mongodb+srv://${nameUser}:${password}@${url}/${nameDb}?retryWrites=true&w=majority`;
  const client = new MongoClient(DBURI);

  try {
    await client.connect();
    const db = client.db(nameDb);
    const collection = db.collection("ingridients");

    const docs = await collection.find({ _id: { $type: "string" } }).toArray();

    if (!docs.length) {
      console.log("Документів зі string _id не знайдено");
      return;
    }

    const ops = docs.flatMap(doc => {
      const newId = new ObjectId();
      const newDoc = { ...doc, _id: newId };

      return [
        { insertOne: { document: newDoc } },
        { deleteOne: { filter: { _id: doc._id } } }
      ];
    });

    await collection.bulkWrite(ops);

    console.log(`Міграція завершена! Оновлено ${docs.length} документів`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

migrateIds();