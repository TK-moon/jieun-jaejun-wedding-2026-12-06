const toPhoneDigits = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const getTelHref = (phone: string): string => {
  return `tel:${toPhoneDigits(phone)}`;
};

export const getSmsHref = (phone: string): string => {
  return `sms:${toPhoneDigits(phone)}`;
};
