import uuidv1 from 'uuid/v1';

import { geocodePlacename } from './leaflet';

/**
 * resolveLensAutocomplete
 * @description Async function used to fetch autocomplete results for SearchBox component
 */

let queryCompleteGlobalNonce;
let queryCompleteRequests = [];

export async function resolveLensAutocomplete (query) {
  // Generate a unique ID and store it as a nonce

  const id = uuidv1();
  const localNonce = (queryCompleteGlobalNonce = id);

  // If this instance of the local nonce doesn't match
  // the global one, it means it's stale, so return

  if (localNonce !== queryCompleteGlobalNonce) return;

  let geocode = geocodePlacename(query);

  // Push the current request into a globally stored
  // variable to allow us to keep track of history

  queryCompleteRequests.push({
    id,
    promise: geocode
  });

  // Run through all previous requests, cancel any thta
  // didn't complete and remove them from the request array

  queryCompleteRequests
    .filter(request => request.id !== id && !request.promise.isCanceled)
    .forEach((request, index) => {
      request.promise.cancel();
      queryCompleteRequests.splice(index, 1);
    });

  try {
    geocode = await geocode;
  } catch (e) {
    // A cancelled request throws an error, so if it's
    // cancelled, catch it and don't consider it one

    if (geocode.isCanceled) return;

    throw new Error(`Failed to geocode placename: ${e}`);
  }

  // Again, if this instance of the request doesn't match the
  // global one, we want to cancel it and return, to avoid
  // updating the application with stale data

  if (localNonce !== queryCompleteGlobalNonce) {
    if (typeof geocode.cancel === 'function') {
      geocode.cancel('Canceling stale geocode placename request');
    }
    return;
  }

  // Finally grab the geocode candidates and return them as our data

  const { candidates = [] } = geocode;

  return candidates.map(mapGeocodeCandidates);
}

/**
 * mapGeocodeCandidates
 * @description Function that takes a given candidate and returns usable result object
 */

export function mapGeocodeCandidates ({ address, location } = {}) {
  return {
    label: address,
    sublabel: `Location: ${location.x}, ${location.y}`,
    value: location
  };
}
