import { parse } from 'node-html-parser'
import axios from 'axios'

const app = async () => {
  let list = []
  let html = await axios.get('https://en.wikipedia.org/wiki/List_of_The_Blacklist_episodes')
  html = parse(html.data)

  html.querySelectorAll(".wikiepisodetable .vevent").forEach(event => {
    const tds = event.querySelectorAll('td')
    let title = tds[1].text.replace(/(^"|"$)/g, "")
    const no = tds[2].text
    if (no.startsWith("No. ")) {
      list.push({
        title,
        number: parseInt(no.replace("No. ", ""), 10)
      })
    }
  })

  list = list.sort((a, b) => {
    return a.number - b.number
  })

  const index = list.reduce((memo, item) => {
    if (!memo[item.number]) {
      memo[item.number] = item
    }

    return memo
  }, {})

  const firstNumber = list[0].number
  const lastNumber = list[list.length - 1].number

  let currentNumber = firstNumber

  while(currentNumber <= lastNumber) {
    const item = index[currentNumber]
    if (item) {
      console.log(`${item.number} - ${item.title}`)
    } else {
      console.log(`${currentNumber}`)
    }
    currentNumber += 1
  }
}

app()