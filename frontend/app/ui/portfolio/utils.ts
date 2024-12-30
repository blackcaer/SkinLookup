import { PriceHistory } from "@/app/ui/common/types";

// Helper function to find the closest previous dataPoint
const findClosestPreviousDataPoint = (phsm: PriceHistory[], date: string) => {
  if (new Date(phsm[0].date) > new Date(date)) {
    return null;
  }
  for (let i = phsm.length - 1; i >= 0; i--) {
    if (new Date(phsm[i].date) < new Date(date)) {
      return phsm[i];
    }
  }
  return null;
};

export const mergeListOfPhsm = (phsmList: PriceHistory[][]) => {
  const combinedData: { date: string; median: number; volume: number }[] = [];

  // Collect all unique dates
  const allDates = new Set<string>();
  phsmList.forEach((phsm) => {
    phsm.forEach((dataPoint) => {
      allDates.add(dataPoint.date);
    });
  });

  // Combine data for each date
  allDates.forEach((date) => {
    let totalMedian = 0;
    let totalVolume = 0;

    phsmList.forEach((phsm) => {
      let dataPoint: PriceHistory | undefined | null = phsm.find(
        (dp) => dp.date === date
      );
      if (!dataPoint) {
        dataPoint = findClosestPreviousDataPoint(phsm, date);
      }
      if (dataPoint) {
        totalMedian += dataPoint.median;
        totalVolume += dataPoint.volume;
      }
    });

    combinedData.push({ date, median: totalMedian, volume: totalVolume });
  });

  // Sort combined data by date
  combinedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return combinedData;
};
