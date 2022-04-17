import { table, findRecordByFilter } from "../../lib/airtable";

const CreateCoffeeStore = async (req, res) => {
   if (req.method === "POST") {
      const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

      try {
         if (id) {
            const records = await findRecordByFilter(id);

            if (records.length !== 0) {
               res.json(records);
            } else {
               if (name) {
                  const createdRecord = await table.create([
                     {
                        fields: {
                           id,
                           name,
                           address,
                           neighbourhood,
                           voting,
                           imgUrl,
                        },
                     },
                  ]);

                  const record = getMinifiedRecords(createdRecord);
                  res.json(record);
               } else {
                  res.status(400).json({ message: "name is missing" });
               }
            }
         } else {
            res.status(400).json({ message: "id is missing" });
         }
      } catch (err) {
         console.error("Error creating or finding store", err);
         res.status(500).json({ message: "Error creating or finding store" });
      }
   }
};

export default CreateCoffeeStore;
