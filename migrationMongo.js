import { MongoClient, ObjectId } from "mongodb";
import { recipeModel } from "./src/models/recipe.js";
import mongoose from "mongoose";
import { ingredientModel } from "./src/models/ingredient.js";
import { User } from "./src/models/user.js";
import { log } from "console";
import bcrypt from "bcrypt";

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

    const ops = docs.flatMap((doc) => {
      const newId = new ObjectId();
      const newDoc = { ...doc, _id: newId };

      return [
        { insertOne: { document: newDoc } },
        { deleteOne: { filter: { _id: doc._id } } },
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

export async function migrateCalValue() {
  const recipes = await recipeModel.find();
  let count = 0;
  for (const recipe of recipes) {
    recipe.cals = Math.floor(Math.random() * 1000 + 10);
    await recipe.save();
    count++;
  }

  console.log("Updates count: " + count);
}

export async function migrateIngredientsId() {
  const recipes = await recipeModel.find();
  let count = 0;
  // for (const recipe of recipes) {
  //   // console.log("🚀 ~ migrateIngredientsId ~ recipe:", recipe.title);
  //   const ingredients = recipe.ingredients;
  //   for (const ing of ingredients) {
  //     ing.id = new mongoose.Types.ObjectId(ing.newId);
  //     //console.log("🚀 ~ migrateIngredientsId ~ ing.id:", ing);
  //     // видаляємо поле
  //   }
  //   count++;

  //   await recipe.save();

  //   //console.log("🚀 ~ migrateIngredientsId ~ recipe:", recipe);
  // }
  // const result = await recipeModel.updateMany(
  //   {}, // всі документи
  //   { $unset: { "ingredients.$[].newId": "" } } // видаляємо поле id у кожному елементі масиву
  // );
  const inf = recipes[0].ingredients[0];

  console.log(
    await ingredientModel.findOne({
      _id: recipes[0].ingredients[0].id,
    })
  );

  console.log("Updates count: " + count);
}

export async function migrateUserFields() {
  // const resultSet = await User.updateMany(
  //   {}, // всі документи
  //   { $set: { favourites: [] } }
  //   // видаляємо поле id у кожному елементі масиву
  // );
  // const password = (await bcrypt.hash("12345678", 10)).toString();
  // const resultSetP = await User.updateMany(
  //   {}, // всі документи
  //   { $set: { password: password } }
  // );
  const recipes = await recipeModel.find();
  const users = await User.find();
  let count = 0;
  for (const user of users) {
    // console.log("🚀 ~ migrateIngredientsId ~ recipe:", recipe.title);
    let favourites = user.favourites;
    favourites = [];
    for (let i = 0; i < 5; i++) {
      favourites.push(recipes[count * 5 + i + 1]._id);
    }
    count++;
    user.favourites = favourites;
    user.save();

    //console.log("🚀 ~ migrateIngredientsId ~ recipe:", recipe);
  }
  log("Ok");
}

export const migrateTime = async () => {
  //const recipes = await recipeModel.find();
  const resultSet = await recipeModel.updateMany(
    {}, // всі документи
    { $unset: { instruction: "" } }
  );
  let count = 0;
  // recipes.forEach((recipe) => {
  //   //recipe.saveTime = recipe.time;
  //   let ins = recipe.instruction;
  //   if (ins) {
  //     recipe.instructions = ins;
  //     count++;
  //   }

  // if (isNaN(newTime)) newTime = 0;
  // recipe.time = newTime;
  // if (recipe.title === undefined) {
  //   recipe.title = "Recipe";
  // }
  //   recipe.save();
  // });
  console.log("🚀 ~ migrateTime ~ count:", count);
};

export const migrateIsConfirmed = async () => {
  const user = await User.updateMany({}, { $set: { isConfirmed: true } });
  console.log("🚀 ~ migrateIsConfirmed ~ user:", user);
};
