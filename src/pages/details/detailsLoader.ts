import { Params } from 'react-router-dom';
import { getPackage } from '../../api/queries/getPackage';
import { PackageDetails } from '../../api/types/packageDetails';

interface LoaderArgs {
  params: Params;
}

export interface DetailsLoaderResult {
  details: PackageDetails;
}

export default async function detailsLoader({ params }: LoaderArgs): Promise<DetailsLoaderResult> {
  const { name } = params;

  if (!name) {
    throw new Error('Name must be provided');
  }

  try {
    const details = await getPackage(name);
    return { details };
  } catch (error) {
    throw new Response('Not Found', { status: 404 });
  }
}
