export async function getItems () {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(new Error('Something went wrong'))
      resolve([
        {
          id: 1,
          title: 'Grocery shopping',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false
        },
        {
          id: 2,
          title: 'Clean the house',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false
        },
        {
          id: 3,
          title: 'Go to the gym',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          done: false
        }
      ])
    }, 1000)
  })
}

export async function getList () {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(new Error('Something went wrong 2'))
      resolve([
        { id: 1, title: 'Some item #1' },
        { id: 2, title: 'Some item #2' }
      ])
    }, 3000)
  })
}
