import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
   const { id } = req.query;

   try {
      if (id) {
         const records = await findRecordByFilter(id);

         if (records.length !== 0) {
            res.json(records);
         } else {
            res.json({ mesage: `id could not be found` });
         }
      } else {
         res.status(400).json({ message: "id is missing" });
      }
   } catch (err) {
      res.status(500).json({ message: "something went wrong", err });
   }
};

export default getCoffeeStoreById;
