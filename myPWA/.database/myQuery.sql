CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  tags TEXT NOT NULL,
  ingredients TEXT NOT NULL, -- comma-separated list for simplicity
  instructions TEXT NOT NULL,
  image TEXT NOT NULL
);

INSERT OR IGNORE INTO recipes (id, title, cuisine, tags, ingredients, instructions, image) VALUES
(1, 'Spaghetti', 'Italian', 'Dinner, Family, Pasta', 'Spaghetti, Olive oil, Garlic, Onion, Tomato sauce, Parmesan', 'Boil spaghetti in salted water. Drain and set aside. Heat olive oil in pan. Sauté garlic and onion until golden. Add tomato sauce and simmer. Toss spaghetti with sauce and sprinkle Parmesan.', '/images/spaghetti.png'),
(2, 'Chicken Tikka Masala', 'Indian', 'Spicy, Non-Veg, Gravy', 'Chicken, Yogurt, Onion, Tomato, Garam masala, Cream', 'Marinate chicken in yogurt and spices. Grill until cooked through. Sauté onion until golden. Add tomato and cook into sauce. Stir in garam masala and cream. Combine chicken with sauce and simmer.', '/images/chicken-tikka.png'),
(3, 'Tacos', 'Mexican', 'Snack, Street Food, Wraps', 'Tortillas, Beef, Onion, Tomato, Lettuce, Cheese', 'Cook beef with onion until browned. Season with spices. Warm tortillas on skillet. Fill tortillas with beef mixture. Add tomato, lettuce, and cheese. Serve with salsa.', '/images/tacos.png'),
(4, 'Thai Green Curry', 'Thai', 'Umami, Spicy, Curry', 'Chicken, Green curry paste, Coconut milk, Eggplant, Basil, Fish sauce', 'Heat curry paste in oil. Add chicken and stir-fry. Pour in coconut milk and simmer. Add chopped eggplant and cook until tender. Season with fish sauce. Garnish with fresh basil.', '/images/thai.png');
