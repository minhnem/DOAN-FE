import { Bill } from "../models/BillsModel"


export const getBestSellingDishes = (bills: Bill[]): { title: string, count: number }[] => {
    const dishCountMap: Record<string, number> = {}

    for (const bill of bills) {
        for (const item of bill.dishItem) {
            if (!dishCountMap[item.title]) {
                dishCountMap[item.title] = 0
            }
            dishCountMap[item.title] += item.count
        }
    }

    const result = Object.entries(dishCountMap)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    return result
}
