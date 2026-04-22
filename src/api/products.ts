// Модуль инкапсулирует запросы к dummyjson. Используем fetch (встроенный),
// чтобы не тянуть axios — для двух простых запросов это оверкилл.

const BASE_URL = "https://dummyjson.com/products";

export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};

export async function fetchCategoryList(): Promise<ProductCategory[]> {
  const res = await fetch(`${BASE_URL}/category-list`);
  if (!res.ok) throw new Error(`Не удалось загрузить категории (${res.status})`);
  const raw = (await res.json()) as unknown;

  // Эндпоинт может вернуть либо массив объектов {slug,name,url},
  // либо (в некоторых версиях) массив строк — нормализуем оба случая.
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      typeof item === "string"
        ? { slug: item, name: item, url: `${BASE_URL}/category/${item}` }
        : (item as ProductCategory),
    );
  }
  return [];
}

export interface AddProductPayload {
  title: string;
}

export interface AddProductResponse {
  id: number;
  title: string;
}

export async function addProduct(payload: AddProductPayload): Promise<AddProductResponse> {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Не удалось отправить заявку (${res.status})`);
  return (await res.json()) as AddProductResponse;
}
