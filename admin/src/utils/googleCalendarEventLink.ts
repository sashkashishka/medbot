interface iOptions {
  id: string;
  email: string;
}

export function googleCalendarEventLink({ id, email }: iOptions) {
  const [name] = email.split('@');

  return `https://www.google.com/calendar/event?eid=${btoa(`${id} ${name}@g`)}`;
}
