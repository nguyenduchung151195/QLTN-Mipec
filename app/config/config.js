export const onlyNumber = e => {
  const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
  if (e.keyCode !== 8 && (e.keyCode < 48 || e.keyCode > 57 || specialChars.includes(e.key))) {
    e.preventDefault();
    return false;
  }
  return true;
};
export const onlyNumberAndSmaller100 = e => {
  const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
  if (e.keyCode !== 8 && (e.keyCode < 48 || e.keyCode > 57 || specialChars.includes(e.key))) {
    e.preventDefault();
  } else if (e.target.value > 100) {
    e.preventDefault();
  }
};
export const onlyTextAndNumber = e => {
  const specialChars = [
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '=', '+', '-', '`', '~'],
    ['[', ']', '{', '}', '|', ',', '<', '>', '?', '.', ';', '"', "'", ':', '/'],
  ];
  if (specialChars.find(chars => chars.includes(e.key))) {
    e.preventDefault();
  }
};
export const noSpaceStartAndEnd = e => {
  if (e.target.value.length === 0 && e.keyCode === 32) {
    e.preventDefault();
  } else {
    const str = e.target.value;
    const lastChar = str.substr(str.length - 1);
    if (lastChar === e.key) {
      e.preventDefault();
    }
  }
};
export const initialDate = () => {
  const d = new Date();
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  return `${d.getFullYear()}-${month}-${date}`;
};

export const compareDates = (start, end) => {
  const startDay = Date.parse(start);
  const endDay = Date.parse(end);
  if (endDay < startDay) {
    return {
      bool: true,
      helperText: 'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu',
    };
  }
  return {
    bool: false,
    helperText: '',
  };
};
