export interface ShoppingListItem {
  ingredient: string;
  checked: boolean;
}

const STORAGE_KEY = 'shoppingList';

export function getShoppingList(): ShoppingListItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addIngredientsToList(ingredients: string): void {
  const lines = ingredients.split('\n').map(line => line.trim()).filter(Boolean);
  const current = getShoppingList();
  
  // Create a map for quick lookup
  const existingSet = new Set(current.map(item => item.ingredient.toLowerCase()));
  
  // Add new items that don't exist
  for (const line of lines) {
    if (!existingSet.has(line.toLowerCase())) {
      current.push({ ingredient: line, checked: false });
    }
  }
  
  // Save back
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}

export function toggleItem(ingredient: string): void {
  const list = getShoppingList();
  const item = list.find(i => i.ingredient === ingredient);
  if (item) {
    item.checked = !item.checked;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }
}

export function removeItem(ingredient: string): void {
  const list = getShoppingList().filter(i => i.ingredient !== ingredient);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function clearList(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function isRecipeInList(ingredients: string): boolean {
  const lines = ingredients.split('\n').map(line => line.trim()).filter(Boolean);
  const list = getShoppingList();
  const listIngredients = new Set(list.map(item => item.ingredient.toLowerCase()));
  
  // Check if ANY ingredient from the recipe is in the list
  return lines.some(line => listIngredients.has(line.toLowerCase()));
}
