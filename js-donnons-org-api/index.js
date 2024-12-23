const DonnonsClient = require('./donnons');

const work = async () => {
    const clientAPI = new DonnonsClient();
    clientAPI.region = "Provence-Alpes-Cote-d-Azur";
    const article = await clientAPI.getByCategoryAndPage(undefined, 5);
    clientAPI.options.limit = 10;
    const article2 = await clientAPI.getByCategory();
    for (const oneArticle of article2.articles) {
        console.log(JSON.stringify(oneArticle, null, 4));
    }
    const number = await clientAPI.calculateNumberOfItems();
    console.log(number.toString())
};

work()