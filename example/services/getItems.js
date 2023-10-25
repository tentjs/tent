export async function getItems() {
  return await new Promise((resolve) => {
    resolve([
      {
        id: 1,
        name: 'JS',
        description: 'JavaScript is nice',
        subtitle: 'JSX',
        done: false,
      },
      {
        id: 2,
        name: 'Svelte',
        description: 'Svelte is cool',
        subtitle: 'SvelteX',
        done: false,
      },
      {
        id: 3,
        name: 'else.js',
        description: 'else.js is awesome',
        subtitle: 'else.jsX',
        done: false,
      },
    ])
  })
}
