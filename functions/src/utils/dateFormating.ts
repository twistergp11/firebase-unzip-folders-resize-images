const dateFormat = (text: string): string => {
  let results = '';

  if (!text) {
    console.log('undefined date');
    results = '';
  } else if (text.length === undefined) {
    results = '';
    console.log('undefined string length');
  } else if (text.length === 0) {
    results = '';
    console.log('empty string');
  } else if (text.length > 10) {
    const datePlain = text.replace(' πμ', '').replace(' μμ', '');

    const listDate = datePlain.split(' ');

    const listdate = listDate[0].split('/');
    const year = listdate[2];
    const month = listdate[1];
    const day = listdate[0];

    console.log(`${year}-${month}-${day}T${listDate[1]}Z`);

    results = `${year}-${month}-${day}T${listDate[1]}Z`;
  } else if (text.length > 5 && text.length < 10) {
    const listdate1 = text.split('/');
    const year = listdate1[2];
    const month = listdate1[1];
    const day = listdate1[0];
    console.log(`${year}-${month}-${day}`);

    results = `${year}-${month}-${day}`;
  }

  return results;
};

export { dateFormat };
