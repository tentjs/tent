export async function getItems() {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'JS',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false,
        },
        {
          id: 2,
          name: 'Svelte',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false,
        },
        {
          id: 3,
          name: 'else.js',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false,
        },
      ])
    }, 1500)
  })
}
