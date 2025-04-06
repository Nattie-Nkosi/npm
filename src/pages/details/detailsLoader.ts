import { Params } from 'react-router-dom';
import { getPackage } from '../../api/queries/getPackage';
import { PackageDetails } from '../../api/types/packageDetails';

interface LoaderArgs {
  params: Params;
}

export interface DetailsLoaderResult {
  details: PackageDetails;
  error?: string;
}

export default async function detailsLoader({ params }: LoaderArgs): Promise<DetailsLoaderResult> {
  const { name } = params;

  if (!name) {
    throw new Response('Package name must be provided', {
      status: 400,
      statusText: 'Bad Request'
    });
  }

  try {
    const details = await getPackage(name);
    return { details };
  } catch (error) {
    // Handle different types of errors appropriately
    if (error instanceof Error) {
      // Package not found
      if (error.message.includes('not found')) {
        throw new Response(`Package "${name}" not found`, {
          status: 404,
          statusText: 'Not Found'
        });
      }

      // Rate limiting
      if (error.message.includes('Too many requests') || error.message.includes('429')) {
        throw new Response('Rate limit exceeded. Please try again later.', {
          status: 429,
          statusText: 'Too Many Requests'
        });
      }

      // Network or other API error
      throw new Response(`Error fetching package details: ${error.message}`, {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }

    // Unknown error
    throw new Response('An unexpected error occurred', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  }
}