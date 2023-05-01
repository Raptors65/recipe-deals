// import React from 'react';
// import { GetStaticPaths, GetStaticProps } from 'next';
// import Link from 'next/link';
// import { RecipeInformation } from '@/types/spoonacular';
// import { getRecipeInfo } from '@/lib/spoonacular';

// type RecipeProps = {
//   recipe: RecipeInformation
// };

// function LoblawsStore({ recipe }: RecipeProps) {
//   // const router = useRouter();
//   // const { storeID } = router.query;

//   return (
//     <div>
//       <h1>{recipe.title}</h1>
//       <p><Link href={recipe.sourceUrl}>Source</Link></p>
//       <p><Link href={recipe.spoonacularSourceUrl}>Spoonacular</Link></p>
//       <p>{JSON.stringify(recipe)}</p>
//     </div>
//   );
// }

// export const getStaticProps: GetStaticProps<RecipeProps> = async (context) => {
//   const recipeInfo = await getRecipeInfo(parseInt(context.params!.recipeID as string, 10));

//   return {
//     props: {
//       recipe: recipeInfo,
//     },
//     revalidate: 60 * 60 * 24 * 7 * 30,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () =>
// ({ paths: [{ params: { recipeID: '651658' } }], fallback: 'blocking' });

// export default LoblawsStore;
