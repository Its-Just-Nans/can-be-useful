import { getInformations, getWidget, getSlotFor } from "./methods.js";

import { number, city } from "./data.js";

const getInfo = (da = [], type, val, defaultVal = null) => {
    const ans = da.find((el) => {
        return el.type === type;
    });
    const correctAns = ans.items.find((el) => {
        return el.label === val;
    });
    if (correctAns) {
        return {
            id: correctAns.id,
            type: type,
            breadcrumb: correctAns.label,
        };
    }
};

const getInfoNumber = (da = [], type, val, defaultVal = null) => {
    const ans = da.find((el) => {
        return el.type === type;
    });
    const correctAns = ans.items.find((el) => {
        return el.label === val;
    });
    if (correctAns) {
        return {
            value: {
                value: defaultVal,
            },
            id: correctAns.id,
            type: "text",
            breadcrumb: "Pré-demande",
        };
    }
};

const getInfoCity = (da = [], type, val, defaultVal = null) => {
    const ans = da.find((el) => {
        return el.type === type;
    });
    const correctAns = ans.items.find((el) => {
        return el.label === val;
    });
    if (correctAns) {
        const valeur = correctAns.value;
        valeur.id = correctAns.id;
        valeur.label = val;
        return {
            value: valeur,
            id: 211,
            type: "radiocity",
            breadcrumb: val,
        };
    }
};

const main = async () => {
    let informations = await getInformations(349);
    let widget = await getWidget("349");
    const a = widget.companies[0].activities[0].prestations.find((el) => {
        return el.name === "Passeport";
    });
    const data = {
        transaction_id: ""
            .concat(informations.professional.id, "_")
            .concat(Math.floor(1e6 * Math.random())),
        id_professional_company: informations.professional.id,
        id_professional_agenda: widget.companies[0].places[0].agendas[0],
        id_professional_prestation:
            widget.companies[0].activities[0].prestations.find((el) => {
                return el.name === "Passeport";
            }).id,
        id_professional_place: informations.professional.places.map((el) => {
            return el.id;
        }),
        source_type: "widget",
        duration: 5,
        number_slots: 1,
        display_time_slots_as_range: false,
        additional_informations_start: [
            getInfo(a.additional_informations_start, "nbpers", "1 personne"),
            getInfoCity(a.additional_informations_start, "radiocity", city),
            getInfoNumber(
                a.additional_informations_start,
                "text",
                "Numéros de pré-demandes",
                number
            ),
        ],
    };
    console.log(JSON.stringify(data, null, 4));
    let res = await getSlotFor(data);
    console.log(res.timeSlots || "rien");
};

setInterval(() => {
    main();
}, 60000);
