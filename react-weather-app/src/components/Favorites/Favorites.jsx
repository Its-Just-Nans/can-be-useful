import "./Favorites.css";
import { useQuery, useMutation } from "react-query";
import { useEffect, useState } from "react";
import { getFav, setFav } from "../../api";

const Query = (props) => {
    const [favList, setFavList] = useState([]);
    const { isLoading, error } = useQuery(["api", favList], async () => {
        const list = await getFav();
        props.setFavList(list);
    });
    const mutation = useMutation(
        async (currentList) => {
            const list = await setFav(currentList);
            props.setFavList(list);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch
                props.queryClient.invalidateQueries("api");
            },
        }
    );
    useEffect(() => {
        if (
            props.favList &&
            favList &&
            props.favList.length !== favList.length
        ) {
            setFavList(props.favList);
            mutation.mutate(props.favList);
        }
        // eslint-disable-next-line
    }, [props.favList]);

    if (isLoading) {
        return (
            <div className="favorites">
                <div className="loader"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="favorites">
                <p>{error.toString()}</p>
            </div>
        );
    }
    return (
        <div className="favorites">
            {favList &&
                favList.map((item) => {
                    return (
                        <div
                            key={item}
                            onClick={() => {
                                props.update(item + " ");
                            }}
                            className="favItem"
                        >
                            <p>{item}</p>
                        </div>
                    );
                })}
        </div>
    );
};

export default Query;
