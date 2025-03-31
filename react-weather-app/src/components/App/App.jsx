import Query from "../Query/Query";
import MyMapComponent from "../Map/Map";
import SearchField from "../SearchField/SearchField";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { LOUVAIN_STR } from "../../constants";
import Favorites from "../Favorites/Favorites";

const queryClient = new QueryClient();
setInterval(() => {
    queryClient.invalidateQueries();
}, 2 * 60 * 1000);

const App = () => {
    const [favList, setFavList] = useState([]);
    const [searchData, setSearchData] = useState(LOUVAIN_STR);
    const [location, setlocation] = useState(LOUVAIN_STR);
    const update = (data) => {
        setSearchData(data);
    };
    return (
        <div className="App">
            <SearchField QueryClient={queryClient} update={update} />
            <QueryClientProvider client={queryClient}>
                <Favorites
                    favList={favList}
                    setFavList={setFavList}
                    queryClient={queryClient}
                    update={update}
                />
            </QueryClientProvider>
            <div className="mapContainer">
                <MyMapComponent update={update} location={location} />
            </div>
            <QueryClientProvider client={queryClient}>
                <Query
                    search={searchData}
                    queryClient={queryClient}
                    updateMap={(data) => {
                        setlocation(data);
                    }}
                    favList={favList}
                    setFavList={(tab) => {
                        setFavList(tab);
                        console.log(tab);
                    }}
                />
                {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
        </div>
    );
};

export default App;
