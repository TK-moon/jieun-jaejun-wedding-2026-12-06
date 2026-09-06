const toPhoneDigits = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

const getTelHref = (phone: string): string => {
  return `tel:${toPhoneDigits(phone)}`;
};

const getSmsHref = (phone: string): string => {
  return `sms:${toPhoneDigits(phone)}`;
};

export { getSmsHref, getTelHref };
