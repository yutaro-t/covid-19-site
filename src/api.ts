import { csvData } from './rt_japan';
import csv from 'csvtojson';
import { DataByPref, prefs } from './type';

export async function fetchData(): Promise<DataByPref> {
  const rawData = await csv().fromString(csvData);
  const result = {} as DataByPref;

  for (const pref of prefs) {
    result[pref] = [];
  }

  for (const row of rawData) {
    if (!result.hasOwnProperty(row.pref))
      throw new Error('未知の都道府県に遭遇しました');
    result[row.pref].push({
      date: new Date(row.date).getTime(),
      range50: [parseFloat(row.Low_50), parseFloat(row.High_50)] as [
        number,
        number
      ],
      range90: [parseFloat(row.Low_90), parseFloat(row.High_90)] as [
        number,
        number
      ],
      ML: parseFloat(row.ML)
    });
  }

  for (const pref of prefs) {
    result[pref].sort((a, b) => b.date - a.date);
  }

  return result;
}
