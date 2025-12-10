import { writable } from 'svelte/store';

const initialPeople = [
  {
    id: 1,
    name: 'Jordan Herman',
    dob: new Date('05-09-2002').toISOString().split('T')[0],
    hasID: false,
  },
  {
    id: 2,
    name: 'Zachary Herman',
    dob: new Date('05-09-2002').toISOString().split('T')[0],
    hasID: true,
  },
];

let nextId = initialPeople.length + 1;

export const people = writable(initialPeople);

export const PeopleStore = {
  addPerson(person) {
    people.update((currentPeople) => {
      const personWithId = { ...person, id: nextId++ };
      return [...currentPeople, personWithId];
    });
  },

  updatePerson(updatedPerson) {
    people.update((currentPeople) => {
      return currentPeople.map((p) => (p.id === updatedPerson.id ? { ...p, ...updatedPerson } : p));
    });
  },

  findPerson(id) {
    let person = undefined;
    const sub = people.subscribe((val) => {
      person = val.find((x) => x.id === id);
    });
    sub();
    return person;
  },

  findPersonWithoutID(p) {
    let person = undefined;
    const sub = people.subscribe((val) => {
      person = val.find((x) => x.name.toLowerCase() === p.name.toLowerCase() && p.dob == x.dob);
    });
    sub();
    return person;
  },

  get People() {
    let currentPeopleValue;

    const unsubscribe = people.subscribe((val) => {
      currentPeopleValue = val;
    });
    unsubscribe();

    return currentPeopleValue;
  },
};
