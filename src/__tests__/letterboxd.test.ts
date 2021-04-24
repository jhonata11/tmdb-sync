import axios, { AxiosStatic } from 'axios'
import * as letterboxd from '../letterboxd'
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<AxiosStatic>

const mockSingleResponse = () =>
  Promise.resolve({
    data: `<?xml version='1.0' encoding='utf-8'?>
    <rss>
      <channel>
          <item> 
            <letterboxd:filmTitle>Beverly Hills Cop</letterboxd:filmTitle>
            <letterboxd:filmYear>1984</letterboxd:filmYear> 
            <letterboxd:memberRating>3.0</letterboxd:memberRating> 
          </item>
      </channel>
    </rss>`,
  })

const mockMultipleResponse = () =>
  Promise.resolve({
    data: `<?xml version='1.0' encoding='utf-8'?>
    <rss>
      <channel>
          <item> 
            <letterboxd:filmTitle>Beverly Hills Cop</letterboxd:filmTitle>
            <letterboxd:filmYear>1984</letterboxd:filmYear> 
            <letterboxd:memberRating>3.0</letterboxd:memberRating> 
          </item>
          <item> 
            <letterboxd:filmTitle>Fight Club</letterboxd:filmTitle>
            <letterboxd:filmYear>1999</letterboxd:filmYear> 
            <letterboxd:memberRating>5.0</letterboxd:memberRating> 
          </item>
      </channel>
    </rss>`,
  })

describe('letterboxd test', () => {
  test('it should call correct url', async () => {
    mockedAxios.get.mockImplementationOnce(mockSingleResponse)
    await letterboxd.getFeed('some-user')
    expect(mockedAxios.get).toHaveBeenLastCalledWith(
      `https://letterboxd.com/some-user/rss/`
    )
  })

  test('it should convert single item', async () => {
    mockedAxios.get.mockImplementationOnce(mockSingleResponse)
    const feed = await letterboxd.getFeed('username')
    expect(feed).toHaveLength(1)
    expect(feed[0]).toEqual({
      rating: 6,
      title: 'Beverly Hills Cop',
      year: 1984,
    })
  })
  test('it should convert multiple items', async () => {
    mockedAxios.get.mockImplementationOnce(mockMultipleResponse)
    const feed = await letterboxd.getFeed('username')
    expect(feed).toHaveLength(2)
    expect(feed[0]).toEqual({
      rating: 6,
      title: 'Beverly Hills Cop',
      year: 1984,
    })
    expect(feed[1]).toEqual({
      rating: 10,
      title: 'Fight Club',
      year: 1999,
    })
  })
})
