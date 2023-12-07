function getUser(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(findUser(id))
    }, 2250)
  })

  function findUser(id) {
    return users.find(user => user.id === parseInt(id))
  }
}

// Mock data
// { id, username, age, address }
const users = [
  { id: 1, username: 'John', age: 32, address: '123 Main St' },
  { id: 2, username: 'Jane', age: 25, address: '456 Main St' },
  { id: 3, username: 'Bob', age: 45, address: '789 Main St' },
]

export { getUser }
