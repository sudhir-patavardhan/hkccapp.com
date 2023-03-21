export function getDateFromStr(dateString) {
  if (dateString && dateString.length >= 1) {
    const dateParts = dateString.split(" ");
    const day = parseInt(dateParts[1]);
    const month = dateParts[0];
    const year = parseInt(dateParts[2]);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = months.findIndex((m) => m === month);

    return new Date(year, monthIndex, day);
  }
  return new Date();
}


export function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}
