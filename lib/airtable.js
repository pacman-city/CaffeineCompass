const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_KEY);


export const table = base('coffee-stores')

// carve out data from response bla bla stuf
export const getMinifiedRecords = (records) => records.map(record => ({recordId:record.id, ...record.fields}) )

export const findRecordByFilter = async (id) => {
	const result = await table.select({ filterByFormula: `id="${id}"` }).firstPage()
	return getMinifiedRecords(result)
}