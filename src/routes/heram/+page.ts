import type { PageLoad } from './$types';

// This page doesn't need dynamic content loading from URL parameters
// Content is handled directly in the component with static data and API calls
export const load: PageLoad = async () => {
  return {
    // Return empty object - all content loading is handled in the component
  };
};
