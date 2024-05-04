interface iOptions {
  id: string;
  email: string;
}

export function googleCalendarEventLink({ id, email }: iOptions) {
  const [name] = email.split('@');

  return `https://calendar.google.com/u/0/r/eventedit/${btoa(`${id} ${name}@g`)}`;
}
