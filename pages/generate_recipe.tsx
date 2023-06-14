import React, { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import prisma from '@/lib/prisma';

type GenerateRecipeProps = {
  ingredients: string[]
};

export default function GenerateRecipe({ ingredients }: GenerateRecipeProps) {
  const { query } = useRouter();
  const [ingredientQuery, setIngredientQuery] = useState(ingredients[0]);
  const [hasEditedQuery, setHasEditedQuery] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recipe, setRecipe] = useState('');

  const sendAIRequest = async () => {
    setGenerating(true);

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredient: ingredientQuery,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setRecipe((r) => r + chunkValue);
    }

    setGenerating(false);
  };

  if (!hasEditedQuery && typeof query.ingredient === 'string' && query.ingredient !== ingredients[0]) {
    setIngredientQuery(query.ingredient);
    setHasEditedQuery(true);
  }

  return (
    <>
      <Head>
        <title>Generate Recipe - Recipe Deals</title>
      </Head>
      <h1 className="text-4xl mb-5">AI Recipe Generator</h1>
      <p className="mb-5">Generate a recipe with the ingredient of your choice.</p>
      <select
        placeholder="Ingredient"
        value={ingredientQuery}
        onChange={({ target }) => {
          setIngredientQuery(target.value);
          if (!hasEditedQuery) setHasEditedQuery(true);
        }}
        disabled={generating}
        className="shadow border border-gray-500 rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      >
        {ingredients.map((ingredient) => (
          <option key={ingredient} value={ingredient}>{ingredient}</option>
        ))}
      </select>
      {!generating && (
        <button
          type="button"
          onClick={sendAIRequest}
          className="ml-2 bg-blue-500 border border-blue-500 text-white px-3 py-2 rounded hover:bg-white hover:text-blue-500"
        >
          Generate
        </button>
      )}
      <p className="mb-10 whitespace-pre-line">{recipe}</p>
    </>
  );
}

export const getStaticProps: GetStaticProps<GenerateRecipeProps> = async () => {
  const ingredients = await prisma.ingredient.findMany();
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);

  return {
    props: {
      ingredients: ingredientNames,
    },
    revalidate: 60 * 60,
  };
};
