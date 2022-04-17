import {
   table,
   getMinifiedRecords,
   findRecordByFilter,
} from "../../lib/airtable";

const FavouriteCoffeeStoteById = async (req, res) => {
   if (req.method === "PUT") {
      const { id } = req.body;

      try {
         if (id) {
            const records = await findRecordByFilter(id);

            if (records.length !== 0) {
               const record = records[0];
               const calculateVoting = parseInt(record.voting) + 1;

               const updateRecord = await table.update([
                  {
                     id: record.recordId,
                     fields: {
                        voting: calculateVoting,
                     },
                  },
               ]);
               if (updateRecord) res.json(getMinifiedRecords(updateRecord));
            } else {
               res.json({ message: `coffee store doesn't exists`, id });
            }
         } else {
            res.status(400).json({});
         }
      } catch (err) {
         res.status(500).json({ message: "error upvoting coffee store", err });
      }
   }
};

export default FavouriteCoffeeStoteById;
