import { fetchCoffeeStores } from "../../lib/coffee-stores";

export default async function getCoffeeStoresByLocation(req, res) {
   try {
      const { latLng, limit } = req.query;
      const response = await fetchCoffeeStores(latLng, limit);
      res.status(200).json(response);
   } catch (err) {
      console.log("there is an error", err);
      res.status(500).json({ message: "something went wrong" });
   }
}
