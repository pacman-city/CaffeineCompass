import { createApi } from "unsplash-js";

const unsplashApi = createApi({
   accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getCoffeeStoresUrl = (latLng, query, limit) => {
   return `https://api.foursquare.com/v3/places/nearby?ll=${latLng}&query=${query}&client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=20221007&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
   const photos = await unsplashApi.search.getPhotos({
      query: "coffee",
      perPage: 40,
   });
   return photos.response.results.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
   latLng = "55.75443168272697,37.64023765378058",
   limit = 20
) => {
   const photos = await getListOfCoffeeStorePhotos();

   const response = await fetch(
      getCoffeeStoresUrl(latLng, "coffee stores", limit),
      { headers: { Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY } }
   );
   const data = await response.json();

   const transformedData =
      data?.results?.map((venue, i) => {
         const neighbourhood = venue.location.neighborhood;
         return {
            id: venue.fsq_id,
            address: venue.location.address || "",
            name: venue.name,
            neighbourhood:
               (neighbourhood &&
                  neighbourhood.length > 0 &&
                  neighbourhood[0]) ||
               venue.location.cross_street ||
               "",
            imgUrl: photos[i],
         };
      }) || [];

   return transformedData;
};
