const padMrz = (value: string, length = 44): string => {
  return `${value}${'<'.repeat(length)}`.slice(0, length);
};

export { padMrz };
