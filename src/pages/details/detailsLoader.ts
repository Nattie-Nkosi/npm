import { Params } from "react-router-dom"
import { getPackage } from "../../api/queries/getPackage";

interface LoaderArgs {
  params: Params
}

export default async function detailsLoader({ params }: LoaderArgs) {
  const { name } = params;

  if (!name) {
    throw new Error('Name must be provided')
  }

  const details = await getPackage(name);
  return {
    details
  }
}
