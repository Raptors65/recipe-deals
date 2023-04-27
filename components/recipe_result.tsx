import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { FindByIngredientsRecipe } from '@/types/spoonacular';

type RecipeResultProps = {
  recipe: FindByIngredientsRecipe
  link: string,
  ingredients: { id: number, ingredient: string }[]
};

export default function RecipeResult({ recipe, link, ingredients }: RecipeResultProps) {
  return (
    <div className="flex justify-between gap-x-5 border-2 p-5">
      <div>
        <h1>{recipe.title}</h1>
        <Image alt={recipe.title} src={recipe.image} width={312} height={231} />
      </div>
      <div className="flex flex-col items-end">
        <Link href={link}>
          <button className="bg-blue-600 text-white p-2 rounded" type="button">Details</button>
        </Link>
        <p className="text-right">
          {recipe.likes}
          {' '}
          likes
        </p>
        <p className="text-right">
          Makes use of:
          {' '}
          {recipe.usedIngredients.map(
            (usedIngredient) => ingredients.find(
              (ingredient) => ingredient.id === usedIngredient.id,
            )?.ingredient || usedIngredient.name,
          ).join(', ')}
          {' '}
          {/* TODO: this won't work if the IDs are different AND the usedIngredient.name
          makes no sense */}
        </p>
      </div>
    </div>
  );
}
