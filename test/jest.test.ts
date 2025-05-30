test('Should know from jest', () => {
  let number: number = 10
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

interface Person{
  name: string,
  email: string
}

test('Should know work with objects', ()=>{
  const obj: Person = {name: 'John', email: 'john@mail.com'};
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'John');
  expect(obj.name).toBe('John');

  const obj2: Person = {name: 'John', email: 'john@mail.com'};
  expect(obj).toEqual(obj2);
  expect(obj.name).toBe(obj2.name);
});