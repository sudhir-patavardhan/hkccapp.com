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
  return '';
}

export function getAgeString(dateOfBirth)
{
  //console.log(dateOfBirth);
  if(dateOfBirth === undefined)
  {
    return '';
  }
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const ageCalc = today.getFullYear() - birthDate.getFullYear();
  const monthCalc = today.getMonth() - birthDate.getMonth();
  if(monthCalc < 0)
  {
      return((ageCalc-1) + 'y ' + (12+monthCalc) + 'mo');
  }
  else{
      return(ageCalc + 'y '+ monthCalc +'mo')
  }
}
