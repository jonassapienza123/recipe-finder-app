// src/App.tsx

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import { logout } from "./authService";
import LoginForm from "./LoginForm";
import "./index.css";
import {
  addFavorite,
  listenToFavorites,
  removeFavorite,
  type FavoriteMeal,
} from "./favoritesService";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
};

type Page = "home" | "recipes" | "favorites" | "report";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("home");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchMeals("chicken");
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const unsubscribe = listenToFavorites(user.uid, setFavorites);

    return () => unsubscribe();
  }, [user]);

  async function fetchMeals(query: string) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const data = await response.json();

    setMeals(data.meals || []);
  }

  async function openMealDetails(mealId: string) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    const data = await response.json();

    setSelectedMeal(data.meals?.[0] || null);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchMeals(searchTerm);
  }

  function isFavorite(mealId: string) {
    return favorites.some((favorite) => favorite.idMeal === mealId);
  }

  async function handleFavoriteClick(meal: Meal) {
    if (!user) {
      alert("Please sign in to save favorites.");
      return;
    }

    if (isFavorite(meal.idMeal)) {
      await removeFavorite(user.uid, meal.idMeal);
    } else {
      await addFavorite(user.uid, meal);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("recipes")}>Recipes</button>
        <button onClick={() => setPage("favorites")}>Favorites</button>
        <button onClick={() => setPage("report")}>Report</button>
      </nav>

      <h1>Recipe Finder</h1>

      {user ? (
        <div className="auth-box">
          <p>Signed in as: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginForm mode="login" />
      )}

      {page === "home" && (
        <section className="hero-section">
          <div className="hero-card">
            <h2>Find simple meal ideas in seconds.</h2>

            <p>
              Search recipes, explore meal ideas and save your favorite dishes
              to your personal collection. Recipe Finder combines an external
              recipe API with Firebase login and user-specific favorites.
            </p>

            <div className="hero-actions">
              <button onClick={() => setPage("recipes")}>
                Explore recipes
              </button>

              <button
                className="secondary-button"
                onClick={() => setPage("favorites")}
              >
                View favorites
              </button>
            </div>
          </div>
        </section>
      )}

      {page === "recipes" && (
        <section>
          <h2>Recipes</h2>

          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
            />

            <button type="submit">Search</button>
          </form>

          {selectedMeal && (
            <div className="report-card">
              <h2>{selectedMeal.strMeal}</h2>

              <img
                src={selectedMeal.strMealThumb}
                alt={selectedMeal.strMeal}
                style={{
                  width: "100%",
                  maxHeight: "360px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  marginBottom: "1rem",
                }}
              />

              <p>
                <strong>Category:</strong> {selectedMeal.strCategory}
              </p>

              <p>
                <strong>Area:</strong> {selectedMeal.strArea}
              </p>

              <p>{selectedMeal.strInstructions}</p>

              <button onClick={() => setSelectedMeal(null)}>
                Close recipe
              </button>
            </div>
          )}

          {meals.length === 0 && <p>No recipes found.</p>}

          <div className="recipe-grid">
            {meals.map((meal) => (
              <div className="recipe-card" key={meal.idMeal}>
                <img src={meal.strMealThumb} alt={meal.strMeal} />

                <div className="recipe-content">
                  <h3>{meal.strMeal}</h3>

                  <button
                    className="secondary-button"
                    onClick={() => openMealDetails(meal.idMeal)}
                  >
                    View recipe
                  </button>

                  <button onClick={() => handleFavoriteClick(meal)}>
                    {isFavorite(meal.idMeal)
                      ? "Remove favorite"
                      : "Add to favorites"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {page === "favorites" && (
        <section>
          <h2>My Favorites</h2>

          {!user && <p>Please sign in to view your favorite recipes.</p>}

          {user && favorites.length === 0 && (
            <p>You do not have any favorite recipes yet.</p>
          )}

          {user && favorites.length > 0 && (
            <div className="recipe-grid">
              {favorites.map((meal) => (
                <div className="recipe-card" key={meal.idMeal}>
                  <img src={meal.strMealThumb} alt={meal.strMeal} />

                  <div className="recipe-content">
                    <h3>{meal.strMeal}</h3>

                    <button
                      onClick={() => removeFavorite(user.uid, meal.idMeal)}
                    >
                      Remove favorite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {page === "report" && (
        <section>
          <h2>Raportti</h2>

          <div className="report-card">
            <p>
              Sovellusta testattiin työpöytäselaimella sekä kapealla
              mobiilinäkymällä. Sivuston rakenne toimii responsiivisesti,
              koska reseptikortit käyttävät CSS Grid -asettelua.
            </p>

            <p>
              Sovellusta testattiin modernilla Chromium-pohjaisella selaimella.
              Hakutoiminto, kirjautuminen, uloskirjautuminen ja suosikkien
              tallennus toimivat oikein.
            </p>

            <p>
              Sivun latautumisaika on kohtuullinen, koska sovellus on rakennettu
              Viten avulla ja reseptidataa haetaan vain tarvittaessa.
            </p>

            <p>
              Saavutettavuudessa huomioitiin selkeä navigaatio, luettavat
              tekstit, näkyvät painikkeet ja yhtenäinen ulkoasu.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;