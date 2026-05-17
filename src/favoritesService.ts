import { ref, set, remove, onValue } from "firebase/database";
import { db } from "./firebase";

export type FavoriteMeal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export function listenToFavorites(
  userId: string,
  callback: (favorites: FavoriteMeal[]) => void
) {
  const favoritesRef = ref(db, `favorites/${userId}`);

  return onValue(favoritesRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    callback(Object.values(data));
  });
}

export async function addFavorite(userId: string, meal: FavoriteMeal) {
  await set(ref(db, `favorites/${userId}/${meal.idMeal}`), meal);
}

export async function removeFavorite(userId: string, mealId: string) {
  await remove(ref(db, `favorites/${userId}/${mealId}`));
}