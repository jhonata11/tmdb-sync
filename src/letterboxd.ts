import axios from 'axios'
import * as xmlParser from 'xml2json'

export interface FeedItem {
  title: string
  year: number
  rating: number
  watchedDate: string
}

interface Item {
  'letterboxd:filmTitle': string
  'letterboxd:filmYear': number
  'letterboxd:memberRating': number
  'letterboxd:watchedDate': string
}

export async function getFeed(username: string): Promise<FeedItem[]> {
  const res = await axios.get(`https://letterboxd.com/${username}/rss/`)
  const json = JSON.parse(xmlParser.toJson(res.data))
  const itemContent = json.rss.channel.item
  const items: Item[] = Array.isArray(itemContent) ? itemContent : [itemContent]
  return items.map((item) => {
    return {
      title: item['letterboxd:filmTitle'],
      year: Number(item['letterboxd:filmYear']),
      rating: Number(item['letterboxd:memberRating']) * 2,
      watchedDate: item['letterboxd:watchedDate'],
    }
  })
}
