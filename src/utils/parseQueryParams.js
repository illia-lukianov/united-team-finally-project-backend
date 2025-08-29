import { ObjectId } from 'mongodb';
//----------FilterParams----------
const parseArray = (arr) => {
  if (typeof arr === 'string' && arr.length > 0) return arr.split(',');
  if (Array.isArray(arr))
    return arr
      .join(',')
      .split(',')
      .filter((e) => typeof e === 'string' && e.length > 0);
  return [];
};

export const parseFilterParams = (query) => {
  const categories = query.categories ?? query['categories[]'];
  const ingredients = query.ingredients ?? query['ingredients[]'];
  const { searchQuery } = query;

  const parsedSearchQuery = typeof searchQuery === 'string' ? searchQuery.trim() : '';
  const parsedCategories = parseArray(categories);
  const parsedIngredients = parseArray(ingredients).map((i) => new ObjectId(i));
  // console.log('parsedCategories', parsedCategories);
  // console.log('parsedIngredients', parsedIngredients);

  return {
    searchQuery: parsedSearchQuery,
    categories: parsedCategories,
    ingredients: parsedIngredients,
  };
};
//----------SortParams----------
const parseSortOrder = (sortOrder) => {
  if (sortOrder === 'desc') return -1;
  return 1;
};

const parseSortBy = (sortBy) => {
  const keysOfRecipes = ['title', 'time', 'cals', 'popularity', 'createdAt', 'updatedAt'];

  if (keysOfRecipes.includes(sortBy)) {
    return sortBy;
  }

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
//----------PaginationParams----------
const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 12);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
