import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { getRecipes } from '@/lib/spoonacular';

type IngredientPageProps = {
  recipes: {
    title: string
    imageURL: string
    spoonacularURL: string
    id: number
  }[],
  ingredientName: string,
};

function IngredientPage({ recipes, ingredientName }: IngredientPageProps) {
  return (
    <>
      <Head>
        <title>
          {ingredientName}
          {' '}
          recipes
        </title>
      </Head>
      <h1>{ingredientName}</h1>
      <div className="flex flex-wrap">
        {recipes.map((recipe) => (
          <div className="m-5 border-2" key={recipe.id} style={{ width: '312px' }}>
            <Image alt={recipe.title} width={312} height={231} src={recipe.imageURL} />
            <div className="w-full p-2">
              <Link href={recipe.spoonacularURL} className="text-lg font-semibold hover:underline">{recipe.title}</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<IngredientPageProps> = async (context) => {
  const ingredientName = context.params!.ingredient as string;
  const recipes = await getRecipes([ingredientName], 5);

  const recipesProp = recipes.map((recipe) => ({
    title: recipe.title,
    imageURL: recipe.image,
    id: recipe.id,
    spoonacularURL: `https://spoonacular.com/-${recipe.id}`,
    // uncomment this line if the above line ever doesn't work
    // spoonacularURL: `https://spoonacular.com/${recipe.title.toLowerCase().replace(/\s+/g, '-').replaceAll(/[^a-zA-Z0-9-]/g, '')}-${recipe.id}`,
  }));

  return {
    props: {
      recipes: recipesProp,
      ingredientName,
    },
    revalidate: 60 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export default IngredientPage;
