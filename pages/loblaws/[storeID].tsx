import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@/lib/prisma';
import { FindByIngredientsRecipe, RecipeInformation } from '@/types/spoonacular';
import { getLoblawsDeals } from '@/api/loblaws';
import { getRecipeInfoBulk, getRecipes } from '@/api/spoonacular';
import RecipeResult from '@/components/recipe_result';
import { Badge, Price } from '@/types/loblaws';

type LoblawsStoreProps = {
  recipes: FindByIngredientsRecipe[]
  recipesInfo: RecipeInformation[]
  deals: { code: string, name: string, ingredient: string, deal: Badge, price: Price,
    ingredientID: number }[]
};

function LoblawsStore({ deals, recipes, recipesInfo }: LoblawsStoreProps) {
  // const router = useRouter();
  // const { storeID } = router.query;

  return (
    <>
      <p>The following are on sale:</p>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Item</th>
            <th>Ingredient</th>
            <th>Normal Price</th>
            <th>Deal</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.code}>
              <td>{deal.name}</td>
              <td>{deal.ingredient}</td>
              <td>
                $
                {deal.price.value}
                {' '}
                {deal.price.unit}
              </td>
              <td>
                {deal.deal.name}
                {' '}
                -
                {' '}
                {deal.deal.text}
              </td>
              <td>{deal.deal.expiryDate?.slice(0, 10) || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {recipes.map((recipe, i) => (
        <RecipeResult
          key={recipe.id}
          recipe={recipe}
          link={recipesInfo[i].spoonacularSourceUrl}
          ingredients={deals.map((deal) => (
            { id: deal.ingredientID, ingredient: deal.ingredient }
          ))}
        />
      ))}
    </>
  );
}

export const getStaticProps: GetStaticProps<LoblawsStoreProps> = async (context) => {
  const loblawsDeals = await getLoblawsDeals(context.params!.storeID as string);

  const ingredientCodes = loblawsDeals.results
    .filter((result) => result.badges.dealBadge !== null)
    .map((result) => result.code);

  const matchingLoblawsItems = await prisma.loblawsItem.findMany({
    where: { code: { in: ingredientCodes } },
    include: { ingredient: true },
  });
  const ingredients = matchingLoblawsItems.map((item) => item.ingredient.name);
  // Remove duplicate ingredients
  const uniqueIngredients = ingredients.filter((x, i) => ingredients.indexOf(x) === i);
  const displayDeals = matchingLoblawsItems
    .map((loblawsItem) => {
      const loblawsInfo = loblawsDeals.results.find((result) => result.code === loblawsItem.code)!;
      return {
        code: loblawsItem.code,
        name: `${loblawsInfo.brand}, ${loblawsInfo.name}`,
        ingredient: loblawsItem.ingredient.name,
        ingredientID: loblawsItem.ingredient.id,
        deal: loblawsInfo.badges.dealBadge!,
        price: loblawsInfo.prices.wasPrice || loblawsInfo.prices.price,
      };
    });

  const recipes = await getRecipes(uniqueIngredients);
  const recipesInfo = await getRecipeInfoBulk(recipes.map((recipe) => recipe.id));

  return {
    props: {
      deals: displayDeals,
      recipes,
      recipesInfo,
    },
    revalidate: 60 * 60 * 24 * 7,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [{ params: { storeID: '1010' } }], fallback: 'blocking' });

export default LoblawsStore;
