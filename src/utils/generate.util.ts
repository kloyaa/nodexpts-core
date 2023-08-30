export const generateDaysOfMonth = (): string[] => {
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const daysOfMonth = Array.from({ length: lastDayOfMonth }, (_, index) => (index + 1).toString());
    return daysOfMonth;
};