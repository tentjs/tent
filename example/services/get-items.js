export async function getItems() {
  return await new Promise((resolve) => {
    resolve([
      {
        id: 1,
        name: 'Grocery shopping',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        done: false,
      },
      {
        id: 2,
        name: 'Clean the house',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        done: false,
      },
      {
        id: 3,
        name: 'Go to the gym',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        done: false,
      },
    ])
  })
}
