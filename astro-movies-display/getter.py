import requests
from json import dumps
import datetime


def request_movies(year):
    headers = {
        "content-type": "application/json",
    }

    json_data = {
        "operationName": "ProductsByRelease",
        "variables": {
            "byPeriod": True,
            "day": None,
            "limit": 10000,
            "month": None,
            "offset": 0,
            "period": "OUTBYYEAR",
            "platformType": None,
            "sortBy": "POPULARITY",
            "universe": "movie",
            "year": year,
        },
        "query": "query ProductsByRelease($byPeriod: Boolean, $day: Int, $limit: Int, $month: Int, $offset: Int, $period: PeriodSort, $sortBy: ProductReleaseSortBy, $platformType: PlatformType, $universe: String!, $year: Int) {\n  productsByRelease(\n    byPeriod: $byPeriod\n    day: $day\n    limit: $limit\n    month: $month\n    offset: $offset\n    period: $period\n    sortBy: $sortBy\n    platformType: $platformType\n    universe: $universe\n    year: $year\n  ) {\n    total\n    limit\n    offset\n    items {\n      ...ProductList\n      synopsis\n      currentUserInfos {\n        ...ProductUserInfos\n        __typename\n      }\n      numberOfSeasons\n      gameSystems {\n        id\n        label\n        __typename\n      }\n      scoutsAverage {\n        average\n        count\n        __typename\n      }\n      tracklistExtract {\n        total\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductList on Product {\n  category\n  channel\n  dateRelease\n  dateReleaseEarlyAccess\n  dateReleaseJP\n  dateReleaseOriginal\n  dateReleaseUS\n  displayedYear\n  duration\n  episodeNumber\n  seasonNumber\n  frenchReleaseDate\n  id\n  numberOfSeasons\n  originalRun\n  originalTitle\n  rating\n  slug\n  subtitle\n  title\n  universe\n  url\n  yearOfProduction\n  tvChannel {\n    name\n    url\n    __typename\n  }\n  countries {\n    id\n    name\n    __typename\n  }\n  gameSystems {\n    id\n    label\n    __typename\n  }\n  medias {\n    picture\n    __typename\n  }\n  genresInfos {\n    label\n    __typename\n  }\n  artists {\n    name\n    person_id\n    url\n    __typename\n  }\n  authors {\n    name\n    person_id\n    url\n    __typename\n  }\n  creators {\n    name\n    person_id\n    url\n    __typename\n  }\n  developers {\n    name\n    person_id\n    url\n    __typename\n  }\n  directors {\n    name\n    person_id\n    url\n    __typename\n  }\n  pencillers {\n    name\n    person_id\n    url\n    __typename\n  }\n  stats {\n    ratingCount\n    __typename\n  }\n  __typename\n}\n\nfragment ProductUserInfos on ProductUserInfos {\n  dateDone\n  hasStartedReview\n  isCurrent\n  id\n  isDone\n  isListed\n  isRecommended\n  isReviewed\n  isWished\n  productId\n  rating\n  userId\n  numberEpisodeDone\n  lastEpisodeDone {\n    episodeNumber\n    id\n    season {\n      seasonNumber\n      id\n      episodes {\n        title\n        id\n        episodeNumber\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  gameSystem {\n    id\n    label\n    __typename\n  }\n  review {\n    author {\n      id\n      name\n      __typename\n    }\n    url\n    __typename\n  }\n  __typename\n}\n",
    }

    response = requests.post(
        "https://apollo.senscritique.com/", headers=headers, json=json_data
    )
    j = response.json()

    return j["data"]["productsByRelease"]["items"]


if __name__ == "__main__":
    MAX_YEAR = datetime.date.today().year + 1
    MIN_YEAR = 1970
    data = {}
    for one_year in range(MIN_YEAR, MAX_YEAR):
        print(f"Getting movies for {one_year}")
        data = request_movies(one_year)
        output_file = f"public/movies_{one_year}.json"
        with open(output_file, "w") as f:
            f.write(dumps(data, indent=4))
