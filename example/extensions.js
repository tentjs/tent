function generateSelectOptions({ self }, { target, items, map }) {
  target.forEach((t) => {
    items.forEach((item) => {
      const option = document.createElement('option')
      option.value = item[map.value]
      option.textContent = item[map.text]
      t.appendChild(option)
    })
  })
}
